import { create } from 'zustand';
import {
  actionsByResource, creatorSeed, currentStaff, disputeSeed, moderationSeed, nid, orderSeed, payoutSeed,
  refundSeed, stamp, serviceSeed, bookingSeed, projectSeed, collectionSeed, broadcastSeed, spaceSeed, auditSeed, supportSeed, userSeed, verificationSeed, workSeed,
  type ActionDef, type AuditEvent, type BaseRow, type CreatorRow, type DisputeRow, type ModRow, type Note,
  type OrderRow, type PayoutRow, type RefundRow, type SupportRow, type ThreadMessage,
  type UserRow, type VerificationRow, type WorkRow, type ServiceRow, type BookingRow, type ProjectRow, type CollectionRow, type BroadcastRow, type SpaceRow,
} from '@/data/admin-data';

export type AdminResources = {
  users: UserRow[]; creators: CreatorRow[]; works: WorkRow[]; orders: OrderRow[]; payouts: PayoutRow[];
  refunds: RefundRow[]; disputes: DisputeRow[]; support: SupportRow[]; verification: VerificationRow[]; moderation: ModRow[];
  services: (ServiceRow & BaseRow)[]; bookings: (BookingRow & BaseRow)[]; projects: ProjectRow[];
  collections: CollectionRow[]; broadcasts: BroadcastRow[]; spaces: SpaceRow[];
};

type AdminState = AdminResources & {
  audit: AuditEvent[];
  record: <K extends keyof AdminResources>(resource: K, id: string) => AdminResources[K][number] | undefined;
  act: (resource: keyof AdminResources, id: string, action: ActionDef, opts?: { reason?: string | undefined }) => void;
  addNote: (resource: keyof AdminResources, id: string, body: string) => void;
  reply: (resource: 'disputes' | 'support', id: string, body: string, from?: string) => void;
  refundFromOrder: (order: OrderRow, reason: string) => RefundRow | undefined;
  resetAll: () => void;
  log: (action: string, resource: string, id: string, reason?: string) => void;
  create: <K extends 'collections' | 'broadcasts' | 'spaces'>(resource: K, row: AdminResources[K][number]) => void;
};

const seeds: AdminResources = {
  users: structuredClone(userSeed), creators: structuredClone(creatorSeed), works: structuredClone(workSeed),
  orders: structuredClone(orderSeed), payouts: structuredClone(payoutSeed), refunds: structuredClone(refundSeed),
  disputes: structuredClone(disputeSeed), support: structuredClone(supportSeed),
  verification: structuredClone(verificationSeed), moderation: structuredClone(moderationSeed),
  services: structuredClone(serviceSeed) as (ServiceRow & BaseRow)[], bookings: structuredClone(bookingSeed) as (BookingRow & BaseRow)[],
  projects: structuredClone(projectSeed), collections: structuredClone(collectionSeed) as CollectionRow[],
  broadcasts: structuredClone(broadcastSeed) as BroadcastRow[], spaces: structuredClone(spaceSeed),
};

const logAudit = (audit: AuditEvent[], action: string, resource: string, resourceId: string, reason?: string): AuditEvent[] => [
  { id: nid(), at: stamp(), actor: currentStaff.name, actorRole: currentStaff.role, action, resource, resourceId, ...(reason ? { reason } : {}) }, ...audit,
];

// Operational state machine for the Operations shell, held in memory for this
// browser session. Preview only — no server records, payments or messages.
export const useAdminOps = create<AdminState>()((set, get) => ({
  ...structuredClone(seeds),
  audit: structuredClone(auditSeed),
  record: (resource, id) => (get()[resource] as BaseRow[]).find((r) => r.id === id) as AdminResources[typeof resource][number] | undefined,
  act: (resource, id, action, opts) => {
    const reason = opts?.reason;
    set((s) => {
      const rows = [...(s[resource] as BaseRow[])];
      const i = rows.findIndex((r) => r.id === id);
      if (i === -1) return {};
      const prev = { ...rows[i] } as Record<string, unknown>;
      const next = { ...prev, ...(action.set ?? {}) } as Record<string, unknown>;
      if (action.to) next['state'] = action.to;
      if (action.id === 'suspend-user') next['state'] = 'suspended';
      rows[i] = next as never;
      const audit = logAudit(s.audit, action.label, resource, id, reason);
      // Cross-resource consequences kept explicit and auditable:
      if (resource === 'orders' && action.id === 'open-dispute') {
        const order = next as unknown as OrderRow;
        const dispute: DisputeRow = {
          id: `D-${105 + s.disputes.length}`, title: `${order.artwork} · ${reason ?? 'Operational issue'}`, type: 'Other',
          customer: order.buyer, creator: order.creator, amount: order.total, opened: stamp().split(',')[0] ?? '', state: 'open',
          priority: 'high', fundsHeld: false, customerPosition: 'Opened by operations — awaiting both parties’ statements.',
          creatorPosition: 'Awaiting the creator’s response.', evidence: [`Opened from order ${order.id}`],
          linked: order.id, linkedKind: 'Order', paymentState: `K${order.total.toLocaleString('en-US')} at risk`, thread: [
            { id: nid(), from: 'System', body: `Dispute opened from order ${order.id}: ${reason ?? 'no reason recorded'}`, at: stamp() },
          ],
        };
        return { [resource]: rows, disputes: [dispute, ...s.disputes], audit } as Partial<AdminState>;
      }
      if (resource === 'orders' && action.id === 'initiate-refund') {
        const order = next as unknown as OrderRow;
        const refund: RefundRow = {
          id: `R-${59 + s.refunds.length}`, order: order.id, artwork: order.artwork, customer: order.buyer, creator: order.creator,
          amount: order.total, reason: reason ?? 'Initiated by operations', requester: 'Operations', state: 'requested',
          requested: stamp(),
        };
        return { [resource]: rows, refunds: [refund, ...s.refunds], audit } as Partial<AdminState>;
      }
      if (resource === 'moderation' && action.id === 'suspend-user') {
        const ownerName = (next as unknown as ModRow).owner;
        const userRows = [...(s.users as UserRow[])];
        const ui = userRows.findIndex((u) => u.name === ownerName);
        if (ui !== -1) userRows[ui] = { ...userRows[ui], state: 'suspended' } as UserRow;
        const audit2 = logAudit(audit, 'Suspend account', 'users', ownerName, `From moderation case ${id}`);
        return { [resource]: rows, users: userRows, audit: audit2 } as Partial<AdminState>;
      }
      return { [resource]: rows, audit } as Partial<AdminState>;
    });
  },
  addNote: (resource, id, body) => {
    const note: Note = { id: nid(), author: currentStaff.name, at: stamp(), body };
    set((s) => {
      const rows = [...(s[resource] as BaseRow[])];
      const i = rows.findIndex((r) => r.id === id);
      if (i === -1 || !body.trim()) return {};
      const cur = rows[i]!;
      rows[i] = { ...cur, notes: [note, ...(cur.notes ?? [])] } as never;
      return { [resource]: rows };
    });
  },
  reply: (resource, id, body, from) => {
    if (!body.trim()) return;
    const message: ThreadMessage = { id: nid(), from: from ?? 'Staff', body, at: stamp() };
    set((s) => {
      const rows = [...(s[resource] as BaseRow[])];
      const i = rows.findIndex((r) => r.id === id);
      if (i === -1) return {};
      const cur = rows[i] as unknown as { thread: ThreadMessage[] };
      rows[i] = { ...rows[i]!, thread: [...cur.thread, message] } as never;
      return { [resource]: rows, audit: logAudit(s.audit, 'Reply sent', resource, id) };
    });
  },
  refundFromOrder: (order, reason) => {
    const refund: RefundRow = {
      id: `R-${59 + get().refunds.length}`, order: order.id, artwork: order.artwork, customer: order.buyer, creator: order.creator,
      amount: order.total, reason, requester: 'Operations', state: 'requested', requested: stamp(),
    };
    set((s) => ({ refunds: [refund, ...s.refunds], audit: logAudit(s.audit, 'Refund initiated', 'orders', order.id, reason) }));
    return refund;
  },
  create: (resource, row) => set((s) => ({ [resource]: [row, ...(s[resource] as BaseRow[])], audit: logAudit(s.audit, 'Created', resource, row.id) }) as Partial<AdminState>),
  log: (action, resource, id, reason) => set((s) => ({ audit: logAudit(s.audit, action, resource, id, reason) })),
  resetAll: () => set({ ...structuredClone(seeds), audit: structuredClone(auditSeed) }),
}));

// Convenience: actions available for a record's current state.
export const actionsFor = (resource: keyof AdminResources, state: string) =>
  (actionsByResource[resource] ?? []).filter((a) => a.from.includes(state));
