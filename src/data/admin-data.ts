// Admin Operations — seed records, staff permissions and action rules.
// Preview data only: nothing here is stored server-side, charged or sent.

export type Priority = 'critical' | 'high' | 'normal' | 'low';
export type Note = { id: string; author: string; at: string; body: string };
export type AuditEvent = { id: string; at: string; actor: string; actorRole: string; action: string; resource: string; resourceId: string; reason?: string | undefined; };
export type ThreadMessage = { id: string; from: string; body: string; at: string };

export const money = (n: number) => `K${n.toLocaleString('en-US')}`;
export const stamp = () => new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const nid = () => Math.random().toString(36).slice(2, 9);

export const currentStaff = { name: 'George Mwale', role: 'Super Admin', initials: 'GM' };

// ---------------- Staff roles & capabilities ----------------
export const staffRoles = [
  { id: 'super', label: 'Super Admin', can: 'Everything, including settings, broadcasts and role assignment.' },
  { id: 'operations', label: 'Operations', can: 'Orders, projects, bookings and dispute resolution. Cannot release payouts.' },
  { id: 'support', label: 'Support', can: 'Cases, contacting users and internal notes. Cannot release payouts or remove works.' },
  { id: 'finance', label: 'Finance', can: 'Payments, payouts and authorized refunds. Cannot remove artworks.' },
  { id: 'moderator', label: 'Moderator', can: 'Content review, hiding works and warnings. No wallet or payment access.' },
  { id: 'curator', label: 'Curator', can: 'Collections and Art for Spaces. No payouts or moderation power.' },
  { id: 'verification', label: 'Verification', can: 'Creator identity and payout verification queues only.' },
] as const;

export const capabilityMatrix = {
  caps: ['users.view', 'users.suspend', 'orders.view', 'orders.manage', 'payments.view', 'refunds.approve', 'payouts.view', 'payouts.manage', 'disputes.view', 'disputes.resolve', 'moderation.action', 'collections.manage'],
  roles: ['Super Admin', 'Operations', 'Support', 'Finance', 'Moderator', 'Curator', 'Verification'],
  // boolean grid keyed by capability → per-role allowance
  grid: {
    'users.view': [1, 1, 1, 0, 1, 0, 0],
    'users.suspend': [1, 1, 0, 0, 1, 0, 0],
    'orders.view': [1, 1, 1, 1, 0, 0, 0],
    'orders.manage': [1, 1, 1, 0, 0, 0, 0],
    'payments.view': [1, 0, 0, 1, 0, 0, 0],
    'refunds.approve': [1, 0, 0, 1, 0, 0, 0],
    'payouts.view': [1, 0, 0, 1, 0, 0, 0],
    'payouts.manage': [1, 0, 0, 1, 0, 0, 0],
    'disputes.view': [1, 1, 1, 1, 1, 0, 0],
    'disputes.resolve': [1, 1, 0, 1, 0, 0, 0],
    'moderation.action': [1, 0, 0, 0, 1, 0, 0],
    'collections.manage': [1, 0, 0, 0, 0, 1, 0],
  } as Record<string, number[]>,
};

// ---------------- Overview ----------------
export const priorityMeta: Record<Priority, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-studio-danger/10 text-studio-danger' },
  high: { label: 'High', className: 'bg-studio-warning/10 text-studio-warning' },
  normal: { label: 'Normal', className: 'bg-studio-info/10 text-studio-info' },
  low: { label: 'Low', className: 'bg-foreground/5 text-muted-foreground' },
};

export const attentionQueue: { id: string; priority: Priority; label: string; detail: string; count: number; to: string }[] = [
  { id: 'at-1', priority: 'critical', label: 'Payouts require review', detail: '1 failed payout needs a retry decision', count: 3, to: '/admin/payouts' },
  { id: 'at-2', priority: 'critical', label: 'Payment reconciliation issue', detail: '1 mobile money settlement does not match its order', count: 1, to: '/admin/payments' },
  { id: 'at-3', priority: 'high', label: 'Disputes waiting on a party', detail: 'Hotel Lobby Mural case is 2 days old', count: 2, to: '/admin/disputes' },
  { id: 'at-4', priority: 'high', label: 'Creators awaiting verification', detail: '2 have waited longer than 24 hours', count: 5, to: '/admin/verification' },
  { id: 'at-5', priority: 'high', label: 'Delivery issues', detail: '4 orders flagged in transit', count: 4, to: '/admin/orders' },
  { id: 'at-6', priority: 'normal', label: 'Moderation reports', detail: '1 copyright complaint needs a decision', count: 7, to: '/admin/moderation' },
  { id: 'at-7', priority: 'low', label: 'Unassigned support cases', detail: 'Assign owners to protect first-response time', count: 2, to: '/admin/support' },
];

export const operationsToday = [
  { label: 'Orders today', value: '9' }, { label: 'Active projects', value: '24' }, { label: 'Payments received', value: 'K186,400' },
  { label: 'Payouts pending', value: '7' }, { label: 'Open disputes', value: '3' }, { label: 'New creators', value: '5' },
];

export const exceptionQueue: { id: string; priority: Priority; what: string; who: string; why: string; amount?: number; to: string }[] = [
  { id: 'ex-1', priority: 'critical', what: 'Failed payout · P-322', who: 'Mwansa Chileshe', why: 'Invalid mobile money account · funds returned to wallet', amount: 8200, to: '/admin/payouts/P-322' },
  { id: 'ex-2', priority: 'critical', what: 'Reconciliation mismatch · PM-1094', who: 'Airtel Money settlement', why: 'Settled K12,500 against an order of K12,000', amount: 12500, to: '/admin/payments/PM-1094' },
  { id: 'ex-3', priority: 'high', what: 'Dispute · D-104', who: 'Latitude Hotel ↔ Mwansa Chileshe', why: 'Concept differs from agreement · funds held', amount: 41000, to: '/admin/disputes/D-104' },
  { id: 'ex-4', priority: 'high', what: 'Delivery issue · O-3308', who: 'Sarah Banda', why: 'Courier reports damage in transit', amount: 4800, to: '/admin/orders/O-3308' },
  { id: 'ex-5', priority: 'normal', what: 'Copyright complaint · M-81', who: '“Lusaka Rooftops” by Taonga Banda', why: 'Claim of a copied composition · creator response window open', to: '/admin/moderation/M-81' },
];

export const marketplaceSnapshot = [
  { label: 'GMS this month', value: 'K412,800', delta: '+12%' }, { label: 'Platform fees', value: 'K49,540', delta: '+9%' },
  { label: 'Active creators', value: '38', delta: '+3' }, { label: 'Works listed', value: '216', delta: '+14' }, { label: 'Average order', value: 'K6,240', delta: '−2%' },
];

// ---------------- Shell navigation ----------------
export type AdminNavItem = { id: string; label: string; to: string; count?: number };
export const adminNav: { group: string | null; items: AdminNavItem[] }[] = [
  { group: null, items: [
    { id: 'overview', label: 'Overview', to: '/admin', count: 15 },
    { id: 'users', label: 'Users', to: '/admin/users' }, { id: 'creators', label: 'Creators', to: '/admin/creators', count: 2 },
  ] },
  { group: 'Marketplace', items: [
    { id: 'works', label: 'Works', to: '/admin/works', count: 3 }, { id: 'services', label: 'Services', to: '/admin/services' },
    { id: 'collections', label: 'Collections', to: '/admin/collections' },
  ] },
  { group: 'Operations', items: [
    { id: 'orders', label: 'Orders', to: '/admin/orders', count: 4 }, { id: 'projects', label: 'Projects', to: '/admin/projects', count: 24 },
    { id: 'bookings', label: 'Bookings', to: '/admin/bookings', count: 2 }, { id: 'support', label: 'Support', to: '/admin/support', count: 5 },
  ] },
  { group: 'Finance', items: [
    { id: 'payments', label: 'Payments', to: '/admin/payments', count: 1 }, { id: 'wallets', label: 'Wallets', to: '/admin/wallets' },
    { id: 'payouts', label: 'Payouts', to: '/admin/payouts', count: 3 }, { id: 'refunds', label: 'Refunds', to: '/admin/refunds', count: 2 },
  ] },
  { group: 'Trust & Safety', items: [
    { id: 'disputes', label: 'Disputes', to: '/admin/disputes', count: 3 }, { id: 'moderation', label: 'Moderation', to: '/admin/moderation', count: 7 },
    { id: 'verification', label: 'Verification', to: '/admin/verification', count: 5 },
  ] },
  { group: 'System', items: [
    { id: 'notifications', label: 'Notifications', to: '/admin/notifications' }, { id: 'settings', label: 'Settings', to: '/admin/settings' },
  ] },
];

// ---------------- Action rules (state machines) ----------------
export type ActionDef = {
  id: string; label: string; from: string[]; to?: string;
  tone?: 'primary' | 'neutral' | 'danger';
  requiresReason?: boolean; financial?: boolean; consequences?: string[];
  set?: Record<string, unknown>;
  noteOnly?: boolean;
};

export const actionsByResource: Record<string, ActionDef[]> = {
  payouts: [
    { id: 'approve', label: 'Approve for processing', from: ['requested'], to: 'processing', tone: 'primary' },
    { id: 'hold', label: 'Place on hold', from: ['requested', 'processing'], to: 'on-hold', requiresReason: true, consequences: ['Funds stay in the creator wallet', 'The creator is told the payout is held and why'] },
    { id: 'release-hold', label: 'Release hold', from: ['on-hold'], to: 'processing', tone: 'primary' },
    { id: 'retry', label: 'Retry payout', from: ['failed'], to: 'processing', tone: 'primary', consequences: ['Funds leave the wallet again', 'The provider is called with the saved payout method'] },
    { id: 'confirm-paid', label: 'Confirm provider paid', from: ['processing'], to: 'paid', tone: 'primary', consequences: ['Wallet balance is reduced', 'The creator receives a paid notification'] },
    { id: 'cancel', label: 'Cancel payout', from: ['requested', 'on-hold'], to: 'cancelled', tone: 'danger', requiresReason: true, consequences: ['Funds return to the creator’s available balance', 'The creator is notified with the reason'] },
    { id: 'escalate', label: 'Escalate to Finance lead', from: ['failed', 'on-hold'], requiresReason: true },
  ],
  refunds: [
    { id: 'approve-full', label: 'Approve full refund', from: ['requested', 'under-review'], to: 'processing', tone: 'primary', financial: true, requiresReason: true, consequences: ['The customer receives the full amount', 'Creator earnings are reversed from the wallet', 'The platform fee is returned'] },
    { id: 'approve-partial', label: 'Approve partial refund', from: ['requested', 'under-review'], to: 'processing', financial: true, requiresReason: true, consequences: ['The customer receives part of the amount', 'Only the refunded share is reversed from the creator'] },
    { id: 'request-info', label: 'Request more information', from: ['requested'], to: 'under-review' },
    { id: 'reject', label: 'Reject refund', from: ['requested', 'under-review'], to: 'rejected', tone: 'danger', requiresReason: true, consequences: ['The customer is notified with the reason', 'No money moves'] },
    { id: 'confirm-refunded', label: 'Confirm provider refunded', from: ['processing'], to: 'refunded', tone: 'primary' },
    { id: 'escalate', label: 'Escalate to a dispute', from: ['requested', 'under-review', 'rejected'] },
  ],
  disputes: [
    { id: 'request-customer', label: 'Request information from customer', from: ['open', 'awaiting-creator', 'under-review'], to: 'awaiting-customer' },
    { id: 'request-creator', label: 'Request information from creator', from: ['open', 'awaiting-customer', 'under-review'], to: 'awaiting-creator' },
    { id: 'review', label: 'Move to internal review', from: ['open', 'awaiting-customer', 'awaiting-creator'], to: 'under-review' },
    { id: 'hold-funds', label: 'Place funds on hold', from: ['open', 'awaiting-customer', 'awaiting-creator', 'under-review', 'escalated'], financial: true, requiresReason: true, set: { fundsHeld: true }, consequences: ['Payouts for this order or project are paused', 'Both parties are notified'] },
    { id: 'release-funds', label: 'Release held funds', from: ['open', 'awaiting-customer', 'awaiting-creator', 'under-review', 'escalated', 'resolved'], set: { fundsHeld: false }, financial: true, requiresReason: true },
    { id: 'refund-full', label: 'Resolve · refund customer in full', from: ['under-review', 'escalated'], to: 'resolved', tone: 'primary', financial: true, requiresReason: true, consequences: ['The customer receives the full amount', 'Creator earnings are reversed', 'The linked order or project closes'] },
    { id: 'refund-partial', label: 'Resolve · partial refund', from: ['under-review', 'escalated'], to: 'resolved', financial: true, requiresReason: true, consequences: ['The customer receives the agreed partial amount', 'The creator keeps the remainder', 'The linked order or project closes'] },
    { id: 'resolve-creator', label: 'Resolve in favor of creator', from: ['under-review', 'escalated'], to: 'resolved', requiresReason: true, consequences: ['Held funds are released to the creator', 'The customer is notified with the reason'] },
    { id: 'escalate', label: 'Escalate case', from: ['open', 'under-review'], to: 'escalated', requiresReason: true },
    { id: 'close', label: 'Close case', from: ['resolved'], to: 'closed' },
  ],
  support: [
    { id: 'start', label: 'Start working the case', from: ['open'], to: 'in-progress', tone: 'primary' },
    { id: 'wait-customer', label: 'Wait on customer', from: ['open', 'in-progress', 'waiting-creator', 'waiting-internal'], to: 'waiting-customer' },
    { id: 'wait-creator', label: 'Wait on creator', from: ['open', 'in-progress', 'waiting-customer', 'waiting-internal'], to: 'waiting-creator' },
    { id: 'wait-internal', label: 'Wait internally', from: ['open', 'in-progress'], to: 'waiting-internal' },
    { id: 'resolve', label: 'Resolve case', from: ['open', 'in-progress', 'waiting-customer', 'waiting-creator', 'waiting-internal'], to: 'resolved', tone: 'primary', requiresReason: true },
    { id: 'close', label: 'Close case', from: ['resolved'], to: 'closed' },
    { id: 'escalate', label: 'Escalate', from: ['open', 'in-progress', 'waiting-internal'], requiresReason: true },
  ],
  verification: [
    { id: 'review', label: 'Start review', from: ['submitted'], to: 'under-review', tone: 'primary' },
    { id: 'request-info', label: 'Request more information', from: ['submitted', 'under-review'], to: 'needs-info', requiresReason: true, consequences: ['The creator is asked for the missing items', 'The case leaves the review queue until they respond'] },
    { id: 'verify', label: 'Mark verified', from: ['submitted', 'under-review', 'needs-info'], to: 'verified', tone: 'primary', consequences: ['The creator’s payout ability is confirmed', 'The creator status updates on their profile'] },
    { id: 'reject', label: 'Reject submission', from: ['submitted', 'under-review', 'needs-info'], to: 'rejected', tone: 'danger', requiresReason: true, consequences: ['The creator is told what to resubmit', 'Payouts stay blocked'] },
  ],
  moderation: [
    { id: 'review', label: 'Start review', from: ['reported', 'action-required', 'appealed'], to: 'under-review', tone: 'primary' },
    { id: 'no-violation', label: 'No violation', from: ['reported', 'under-review', 'action-required', 'appealed'], to: 'resolved', requiresReason: true },
    { id: 'hide', label: 'Hide content', from: ['reported', 'under-review', 'action-required', 'appealed'], to: 'removed', tone: 'danger', requiresReason: true, consequences: ['The content is hidden from the marketplace but kept recoverable', 'The owner is notified'] },
    { id: 'restore', label: 'Restore content', from: ['removed', 'appealed'], to: 'resolved', tone: 'primary' },
    { id: 'warn', label: 'Warn the user', from: ['reported', 'under-review', 'action-required'], to: 'resolved', requiresReason: true },
    { id: 'suspend-user', label: 'Suspend the owner', from: ['under-review', 'action-required'], tone: 'danger', requiresReason: true, consequences: ['The owner’s account is suspended', 'Their listings are hidden'] },
    { id: 'escalate', label: 'Escalate', from: ['reported', 'under-review', 'action-required', 'appealed'], to: 'escalated', requiresReason: true },
  ],
  users: [
    { id: 'suspend', label: 'Suspend account', from: ['active'], to: 'suspended', tone: 'danger', requiresReason: true, consequences: ['Sign-in is blocked on all devices', 'Their listings are hidden from the marketplace', 'Open orders and projects continue'] },
    { id: 'reactivate', label: 'Reactivate account', from: ['suspended', 'deactivated'], to: 'active', tone: 'primary' },
    { id: 'deactivate', label: 'Deactivate account', from: ['active'], to: 'deactivated', requiresReason: true, tone: 'danger', consequences: ['The account is closed at the owner’s request', 'Data is retained per the retention policy'] },
    { id: 'force-logout', label: 'Force sign-out on all devices', from: ['active', 'suspended'], consequences: ['All sessions end within a minute'] },
    { id: 'verify', label: 'Mark email verified', from: ['active'], set: { verification: 'Verified' } },
  ],
  works: [
    { id: 'flag', label: 'Flag for review', from: ['published', 'reserved', 'sold', 'reported'], to: 'under-review', requiresReason: true },
    { id: 'hide', label: 'Hide listing', from: ['published', 'reported', 'under-review'], to: 'hidden', tone: 'danger', requiresReason: true, consequences: ['The listing is removed from the marketplace', 'It stays recoverable', 'The creator is notified'] },
    { id: 'restore', label: 'Restore listing', from: ['hidden', 'archived', 'under-review'], to: 'published', tone: 'primary' },
    { id: 'clear-reports', label: 'Clear reports', from: ['reported', 'under-review'], set: { moderation: 'Clear', reports: 0 }, requiresReason: true },
  ],
  orders: [
    { id: 'flag-issue', label: 'Mark operational issue', from: ['paid', 'creator-confirmation', 'preparing', 'ready', 'dispatched', 'in-transit', 'delivered'], set: { issue: 'Flagged by operations' }, requiresReason: true },
    { id: 'mark-dispatched', label: 'Mark dispatched', from: ['preparing', 'ready'], to: 'dispatched' },
    { id: 'mark-in-transit', label: 'Mark in transit', from: ['dispatched'], to: 'in-transit' },
    { id: 'mark-delivered', label: 'Mark delivered', from: ['in-transit', 'delivery-issue'], to: 'delivered' },
    { id: 'complete', label: 'Mark completed', from: ['delivered'], to: 'completed', tone: 'primary' },
    { id: 'resolve-issue', label: 'Resolve delivery issue', from: ['delivery-issue'], to: 'in-transit', tone: 'primary', requiresReason: true },
    { id: 'open-dispute', label: 'Open a dispute', from: ['paid', 'creator-confirmation', 'preparing', 'ready', 'dispatched', 'in-transit', 'delivered', 'delivery-issue'], to: 'disputed', tone: 'danger', requiresReason: true, consequences: ['A dispute case is opened and linked to this order', 'Funds can be held while it is reviewed'] },
    { id: 'initiate-refund', label: 'Initiate refund', from: ['paid', 'cancelled', 'delivery-issue', 'disputed'], financial: true, requiresReason: true, consequences: ['A refund case is created for review', 'No money moves until Finance approves it'] },
    { id: 'cancel', label: 'Cancel order', from: ['payment-pending', 'paid', 'creator-confirmation'], to: 'cancelled', tone: 'danger', requiresReason: true, consequences: ['The buyer is notified', 'Any captured payment is refunded'] },
  ],
};

// ---------------- Store-managed records ----------------
export type BaseRow = { id: string; state: string; notes?: Note[]; [k: string]: unknown };

export type UserRow = BaseRow & {
  name: string; email: string; phone: string; kind: string; verification: string; joined: string; lastActive: string;
  orders: number; projects: number; disputes: number; spend: number; twoFactor: boolean;
};
export const userSeed: UserRow[] = [
  { id: 'U-2201', name: 'Sarah Banda', email: 'sarah.banda@example.com', phone: '+260 97 1155 220', kind: 'Customer', state: 'active', verification: 'Verified', joined: '14 Mar 2025', lastActive: 'Today, 08:12', orders: 6, projects: 1, disputes: 1, spend: 34800, twoFactor: true },
  { id: 'U-2214', name: 'Chanda Mulenga', email: 'chanda.m@example.com', phone: '+260 96 4410 883', kind: 'Customer + Creator', state: 'active', verification: 'Verified', joined: '2 Jun 2025', lastActive: 'Today, 07:55', orders: 3, projects: 0, disputes: 0, spend: 12100, twoFactor: false },
  { id: 'U-2250', name: 'James Phiri', email: 'j.phiri@example.com', phone: '+260 97 8820 431', kind: 'Customer', state: 'suspended', verification: 'Verified', joined: '9 Nov 2025', lastActive: '5 Oct, 19:22', orders: 2, projects: 0, disputes: 2, spend: 8600, twoFactor: false },
  { id: 'U-2288', name: 'Mutale Nkomo', email: 'mutale.n@example.com', phone: '+260 76 3301 556', kind: 'Customer', state: 'active', verification: 'Unverified', joined: '2 Oct 2026', lastActive: 'Today, 09:40', orders: 0, projects: 0, disputes: 0, spend: 0, twoFactor: false },
  { id: 'U-2303', name: 'Kabwe Hamaundu', email: 'kabwe.h@example.com', phone: '+260 95 7712 004', kind: 'Customer', state: 'deactivated', verification: 'Verified', joined: '21 Jan 2025', lastActive: '12 Sep, 10:03', orders: 4, projects: 0, disputes: 0, spend: 19700, twoFactor: true },
  { id: 'U-2311', name: 'Nawa Chishimba', email: 'nawa.c@example.com', phone: '+260 97 5510 672', kind: 'Customer', state: 'active', verification: 'Verified', joined: '30 Aug 2026', lastActive: 'Yesterday, 21:14', orders: 1, projects: 0, disputes: 0, spend: 5200, twoFactor: false },
];

export type CreatorRow = BaseRow & {
  name: string; discipline: string; payoutVerification: string; works: number; services: number; activeProjects: number; completedProjects: number;
  sales: number; pending: number; available: number; lastPayout: string; reports: number; disputes: number;
};
export const creatorSeed: CreatorRow[] = [
  { id: 'C-101', name: 'Mwansa Chileshe', discipline: 'Painter', state: 'active', payoutVerification: 'Verified', works: 14, services: 2, activeProjects: 3, completedProjects: 11, sales: 84200, pending: 6800, available: 1200, lastPayout: '8 Oct · failed', reports: 1, disputes: 1 },
  { id: 'C-114', name: 'Taonga Banda', discipline: 'Photographer', state: 'under-review', payoutVerification: 'Payout identity pending', works: 22, services: 1, activeProjects: 1, completedProjects: 4, sales: 51600, pending: 0, available: 12800, lastPayout: '1 Oct · paid', reports: 2, disputes: 0 },
  { id: 'C-127', name: 'Chimwemwe Zulu', discipline: 'Sculptor', state: 'paused', payoutVerification: 'Verified', works: 8, services: 0, activeProjects: 0, completedProjects: 7, sales: 38400, pending: 0, available: 0, lastPayout: '5 Oct · paid', reports: 0, disputes: 0 },
  { id: 'C-133', name: 'Lubasi Sinyangwe', discipline: 'Textile artist', state: 'suspended', payoutVerification: 'Verified', works: 11, services: 3, activeProjects: 2, completedProjects: 9, sales: 61900, pending: 2300, available: 0, lastPayout: '4 Oct · failed', reports: 4, disputes: 1 },
  { id: 'C-140', name: 'Mwamba Kapwepwe', discipline: 'Ceramicist', state: 'active', payoutVerification: 'Under review', works: 17, services: 2, activeProjects: 2, completedProjects: 6, sales: 27300, pending: 5400, available: 3100, lastPayout: '6 Oct · on hold', reports: 0, disputes: 0 },
];

export type WorkRow = BaseRow & {
  title: string; artist: string; artistId: string; type: string; price: number; edition: string; moderation: string; reports: number; certificate: string;
};
export const workSeed: WorkRow[] = [
  { id: 'W-501', title: 'After the Rain', artist: 'Mwansa Chileshe', artistId: 'C-101', type: 'Painting', price: 4800, edition: 'Original', moderation: 'Clear', reports: 0, certificate: 'Issued', state: 'published' },
  { id: 'W-512', title: 'Lusaka Rooftops', artist: 'Taonga Banda', artistId: 'C-114', type: 'Photography', price: 3200, edition: 'Edition of 12', moderation: 'Copyright complaint', reports: 1, certificate: 'Issued', state: 'reported' },
  { id: 'W-508', title: 'Copper Voices', artist: 'Chimwemwe Zulu', artistId: 'C-127', type: 'Sculpture', price: 12500, edition: 'Original', moderation: 'Clear', reports: 0, certificate: 'Issued', state: 'sold' },
  { id: 'W-519', title: 'Linen Field Study III', artist: 'Lubasi Sinyangwe', artistId: 'C-133', type: 'Textile', price: 2300, edition: 'Original', moderation: 'Under review', reports: 1, certificate: 'Pending', state: 'under-review' },
  { id: 'W-524', title: 'Kafue Morning', artist: 'Mwamba Kapwepwe', artistId: 'C-140', type: 'Ceramics', price: 1750, edition: 'Original', moderation: 'Clear', reports: 0, certificate: 'Issued', state: 'reserved' },
  { id: 'W-530', title: 'Storm over Libala', artist: 'Mwansa Chileshe', artistId: 'C-101', type: 'Painting', price: 7400, edition: 'Original', moderation: 'Clear', reports: 0, certificate: 'Issued', state: 'published' },
  { id: 'W-533', title: 'Quiet Kitchen', artist: 'Chanda Mulenga', artistId: 'U-2214', type: 'Photography', price: 900, edition: 'Edition of 20', moderation: 'Clear', reports: 0, certificate: 'Issued', state: 'hidden' },
];

export type OrderRow = BaseRow & {
  artwork: string; workId: string; buyer: string; buyerId: string; creator: string; creatorId: string; total: number;
  delivery: string; payment: string; placed: string; issue?: string;
};
export const orderSeed: OrderRow[] = [
  { id: 'O-3308', artwork: 'After the Rain', workId: 'W-501', buyer: 'Sarah Banda', buyerId: 'U-2201', creator: 'Mwansa Chileshe', creatorId: 'C-101', total: 4800, delivery: 'Courier', payment: 'Paid · mobile money', placed: '6 Oct', state: 'delivery-issue', issue: 'Courier reports damage in transit' },
  { id: 'O-3311', artwork: 'Kafue Morning', workId: 'W-524', buyer: 'Nawa Chishimba', buyerId: 'U-2311', creator: 'Mwamba Kapwepwe', creatorId: 'C-140', total: 1750, delivery: 'Collection', payment: 'Paid · card', placed: '7 Oct', state: 'ready' },
  { id: 'O-3312', artwork: 'Storm over Libala', workId: 'W-530', buyer: 'Chanda Mulenga', buyerId: 'U-2214', creator: 'Mwansa Chileshe', creatorId: 'C-101', total: 7400, delivery: 'Courier', payment: 'Pending', placed: '8 Oct', state: 'payment-pending' },
  { id: 'O-3301', artwork: 'Copper Voices', workId: 'W-508', buyer: 'Kabwe Hamaundu', buyerId: 'U-2303', creator: 'Chimwemwe Zulu', creatorId: 'C-127', total: 12500, delivery: 'Courier', payment: 'Paid · card', placed: '2 Oct', state: 'in-transit' },
  { id: 'O-3295', artwork: 'Quiet Kitchen', workId: 'W-533', buyer: 'Mutale Nkomo', buyerId: 'U-2288', creator: 'Chanda Mulenga', creatorId: 'U-2214', total: 900, delivery: 'Collection', payment: 'Paid · mobile money', placed: '29 Sep', state: 'completed' },
  { id: 'O-3290', artwork: 'Linen Field Study II', workId: 'W-519', buyer: 'Sarah Banda', buyerId: 'U-2201', creator: 'Lubasi Sinyangwe', creatorId: 'C-133', total: 2100, delivery: 'Courier', payment: 'Paid · mobile money', placed: '26 Sep', state: 'cancelled' },
  { id: 'O-3288', artwork: 'After the Rain', workId: 'W-501', buyer: 'Sarah Banda', buyerId: 'U-2201', creator: 'Mwansa Chileshe', creatorId: 'C-101', total: 4800, delivery: 'Courier', payment: 'Paid · mobile money', placed: '24 Sep', state: 'delivered' },
];

export type PayoutRow = BaseRow & {
  creator: string; creatorId: string; amount: number; method: string; requested: string; wallet: string; verification: string;
  providerRef?: string; failureReason?: string; fundsRestored?: boolean;
};
export const payoutSeed: PayoutRow[] = [
  { id: 'P-322', creator: 'Mwansa Chileshe', creatorId: 'C-101', amount: 8200, method: 'Airtel Money ·· ·118', state: 'failed', requested: '8 Oct, 09:14', wallet: 'W-71', verification: 'Verified', providerRef: 'AMP-88213', failureReason: 'Invalid mobile money account', fundsRestored: true },
  { id: 'P-321', creator: 'Chanda Mulenga', creatorId: 'U-2214', amount: 3100, method: 'Zanaco bank ··4471', state: 'processing', requested: '7 Oct, 16:40', wallet: 'W-72', verification: 'Verified', providerRef: 'BNK-55102' },
  { id: 'P-320', creator: 'Taonga Banda', creatorId: 'C-114', amount: 12800, method: 'MTN MoMo ·· ·902', state: 'requested', requested: '7 Oct, 11:05', wallet: 'W-73', verification: 'Payout identity pending' },
  { id: 'P-319', creator: 'Mwamba Kapwepwe', creatorId: 'C-140', amount: 5400, method: 'Airtel Money ·· ·771', state: 'on-hold', requested: '6 Oct, 14:22', wallet: 'W-74', verification: 'Under review' },
  { id: 'P-318', creator: 'Chimwemwe Zulu', creatorId: 'C-127', amount: 9600, method: 'Zanaco bank ··2210', state: 'paid', requested: '5 Oct, 09:31', wallet: 'W-75', verification: 'Verified', providerRef: 'BNK-54993' },
  { id: 'P-317', creator: 'Lubasi Sinyangwe', creatorId: 'C-133', amount: 2300, method: 'MTN MoMo ·· ·645', state: 'failed', requested: '4 Oct, 17:48', wallet: 'W-76', verification: 'Verified', providerRef: 'AMP-88110', failureReason: 'Provider timeout · no funds moved', fundsRestored: true },
];

export type RefundRow = BaseRow & {
  order: string; artwork: string; customer: string; creator: string; amount: number; reason: string; requester: string; requested: string; evidence?: string;
};
export const refundSeed: RefundRow[] = [
  { id: 'R-58', order: 'O-3308', artwork: 'After the Rain', customer: 'Sarah Banda', creator: 'Mwansa Chileshe', amount: 4800, reason: 'Damaged in transit', requester: 'Customer', state: 'requested', requested: '8 Oct, 10:02', evidence: 'Photos of damaged frame supplied' },
  { id: 'R-57', order: 'O-3290', artwork: 'Linen Field Study II', customer: 'Sarah Banda', creator: 'Lubasi Sinyangwe', amount: 2100, reason: 'Order cancelled before dispatch', requester: 'System', state: 'processing', requested: '6 Oct, 13:20' },
  { id: 'R-56', order: 'O-3281', artwork: 'Copper Voices (maquette)', customer: 'James Phiri', creator: 'Chimwemwe Zulu', amount: 1500, reason: 'Changed mind within cooling-off window', requester: 'Customer', state: 'refunded', requested: '1 Oct, 09:12' },
  { id: 'R-55', order: 'O-3277', artwork: 'Dust Road', customer: 'Nawa Chishimba', creator: 'Taonga Banda', amount: 3200, reason: 'Print quality below listing description', requester: 'Customer', state: 'under-review', requested: '30 Sep, 17:44', evidence: 'Awaiting close-up photos from the customer' },
  { id: 'R-54', order: 'O-3270', artwork: 'Market Morning', customer: 'Kabwe Hamaundu', creator: 'Mwamba Kapwepwe', amount: 1900, reason: 'Requested outside policy window', requester: 'Customer', state: 'rejected', requested: '24 Sep, 11:30' },
];

export type DisputeRow = BaseRow & {
  title: string; type: string; customer: string; creator: string; amount: number; opened: string; priority: Priority; fundsHeld: boolean;
  customerPosition: string; creatorPosition: string; evidence: string[]; linked: string; linkedKind: string; paymentState: string; thread: ThreadMessage[];
};
export const disputeSeed: DisputeRow[] = [
  { id: 'D-104', title: 'Hotel Lobby Mural · concept not as agreed', type: 'Work differs from agreement', customer: 'Latitude Hotel (Kabwe Hamaundu)', creator: 'Mwansa Chileshe', amount: 41000, opened: '6 Oct', state: 'under-review', priority: 'high', fundsHeld: true,
    customerPosition: 'The second concept uses cooler tones than the agreed palette and the mural reads blue in the lobby lighting. The approved direction was warmer.',
    creatorPosition: 'The palette shift was proposed in writing on 20 Sep and the client replied “proceed”. No contractual palette was attached to the project.',
    evidence: ['Approved concept sketch (20 Sep)', 'Client reply “proceed” (21 Sep)', 'Photos of installed mural under lobby lighting'],
    linked: 'Hotel Lobby Mural', linkedKind: 'Project', paymentState: 'K24,600 held (deposit + milestone 1)', thread: [
      { id: 't1', from: 'System', body: 'Dispute opened. Funds held pending review.', at: '6 Oct, 15:10' },
      { id: 't2', from: 'Customer', body: 'We asked for warm ochres. The installed mural is visibly blue in our lighting.', at: '6 Oct, 16:02' },
      { id: 't3', from: 'Creator', body: 'The change was agreed in writing. I can repaint sections, but that is new scope.', at: '7 Oct, 09:41' },
    ] },
  { id: 'D-101', title: 'After the Rain · arrived damaged', type: 'Damaged artwork', customer: 'Sarah Banda', creator: 'Mwansa Chileshe', amount: 4800, opened: '8 Oct', state: 'awaiting-creator', priority: 'high', fundsHeld: true,
    customerPosition: 'The frame corner is split and the canvas is creased. Photos taken at unboxing show the damage.',
    creatorPosition: 'Awaiting the creator’s response — dispatched with corner protectors and signed handover to the courier.',
    evidence: ['Unboxing photos (customer)', 'Courier handover receipt', 'Packaging specification for this work'],
    linked: 'O-3308', linkedKind: 'Order', paymentState: 'K4,800 held', thread: [
      { id: 't1', from: 'System', body: 'Dispute opened from support case S-409. Funds held.', at: '8 Oct, 10:30' },
      { id: 't2', from: 'Customer', body: 'Photos attached in the support case. I would prefer a replacement if the artist has one.', at: '8 Oct, 10:44' },
    ] },
  { id: 'D-99', title: 'Commission deadline missed', type: 'Missed deadline', customer: 'Nawa Chishimba', creator: 'Lubasi Sinyangwe', amount: 12500, opened: '2 Oct', state: 'escalated', priority: 'critical', fundsHeld: true,
    customerPosition: 'The commissioned series was due 20 Sep for a launch. It has not been delivered and communication stopped for nine days.',
    creatorPosition: 'The creator has not responded to the extension request. Account is currently suspended for a separate moderation matter.',
    evidence: ['Signed agreement with 20 Sep delivery', 'Message history (last reply 21 Sep)', 'Extension request (24 Sep, unanswered)'],
    linked: 'Chishimba textile series', linkedKind: 'Project', paymentState: 'K12,500 held', thread: [
      { id: 't1', from: 'System', body: 'Escalated after 5 days without creator response.', at: '5 Oct, 09:00' },
    ] },
  { id: 'D-95', title: 'Print shade differs from listing', type: 'Other', customer: 'Kabwe Hamaundu', creator: 'Taonga Banda', amount: 3200, opened: '26 Sep', state: 'resolved', priority: 'normal', fundsHeld: false,
    customerPosition: 'The print reads noticeably warmer than the listing image.',
    creatorPosition: 'Paper stock changed between editions; offered a replacement from the corrected run.',
    evidence: ['Listing image', 'Received print photo', 'Creator’s paper-stock note'],
    linked: 'O-3277', linkedKind: 'Order', paymentState: 'No funds held', thread: [
      { id: 't1', from: 'Creator', body: 'Happy to replace from the corrected run at no cost.', at: '27 Sep, 12:15' },
      { id: 't2', from: 'System', body: 'Resolved in favor of customer · replacement shipped. Case closed.', at: '29 Sep, 08:20' },
    ] },
];

export type SupportRow = BaseRow & {
  subject: string; source: string; customer: string; creator?: string; linked: string; opened: string; assignedTo?: string; sla: string; thread: ThreadMessage[];
};
export const supportSeed: SupportRow[] = [
  { id: 'S-410', subject: 'Can’t change payout method', source: 'Payout', customer: 'Chanda Mulenga', linked: 'P-321', opened: '8 Oct, 07:40', sla: 'First response due 12:00', state: 'open', thread: [
    { id: 't1', from: 'Customer', body: 'My bank account changed and the payout screen says “locked while a payout is processing”.', at: '8 Oct, 07:41' },
  ] },
  { id: 'S-409', subject: 'Artwork arrived damaged', source: 'Order', customer: 'Sarah Banda', creator: 'Mwansa Chileshe', linked: 'O-3308', opened: '8 Oct, 09:55', assignedTo: 'Diana K., Support', sla: 'Responded · dispute opened', state: 'waiting-creator', thread: [
    { id: 't1', from: 'Customer', body: 'The frame arrived split. Photos attached.', at: '8 Oct, 09:56' },
    { id: 't2', from: 'Staff', body: 'So sorry to see this. I’ve opened dispute D-101 so funds are protected while we fix it.', at: '8 Oct, 10:30' },
  ] },
  { id: 'S-407', subject: 'Verification documents rejected twice', source: 'Account', customer: 'Mwamba Kapwepwe', linked: 'V-31', opened: '6 Oct, 14:10', sla: 'Waiting internally 2 days', state: 'waiting-internal', thread: [
    { id: 't1', from: 'Customer', body: 'My NRC scans were rejected but I can’t see why.', at: '6 Oct, 14:11' },
  ] },
  { id: 'S-405', subject: 'Booking reschedule request', source: 'Booking', customer: 'Mutale Nkomo', creator: 'Taonga Banda', linked: 'B-88', opened: '5 Oct, 16:33', assignedTo: 'Diana K., Support', sla: 'Responded · awaiting customer', state: 'waiting-customer', thread: [
    { id: 't1', from: 'Customer', body: 'Can we move the sitting from Thursday to next Monday?', at: '5 Oct, 16:34' },
    { id: 't2', from: 'Staff', body: 'I’ve asked the photographer — Monday 10:00 is open on her calendar.', at: '5 Oct, 17:02' },
  ] },
  { id: 'S-402', subject: 'Refund requested outside window', source: 'Payment', customer: 'Kabwe Hamaundu', linked: 'R-54', opened: '24 Sep, 11:31', assignedTo: 'Finance', sla: 'Resolved', state: 'resolved', thread: [
    { id: 't1', from: 'Staff', body: 'Explained the 14-day window and pointed at the policy page. Case resolved.', at: '24 Sep, 15:40' },
  ] },
];

export type VerificationRow = BaseRow & {
  creator: string; creatorId: string; type: string; submitted: string; documents: string[]; waiting?: string;
};
export const verificationSeed: VerificationRow[] = [
  { id: 'V-31', creator: 'Mwamba Kapwepwe', creatorId: 'C-140', type: 'Payout identity', state: 'needs-info', submitted: '5 Oct, 11:20', documents: ['NRC scan (front)', 'NRC scan (back)'], waiting: 'Previous submission rejected: scan cropped' },
  { id: 'V-30', creator: 'Taonga Banda', creatorId: 'C-114', type: 'Identity', state: 'submitted', submitted: '6 Oct, 09:05', documents: ['Passport photo page', 'Selfie match'] },
  { id: 'V-29', creator: 'Mwansa Chileshe', creatorId: 'C-101', type: 'Business verification', state: 'under-review', submitted: '7 Oct, 15:48', documents: ['PACRA certificate', 'TIN certificate'] },
  { id: 'V-28', creator: 'Nkosi Mvula', creatorId: 'C-155', type: 'Professional profile', state: 'submitted', submitted: '8 Oct, 08:12', documents: ['Portfolio link', 'Two references'] },
  { id: 'V-27', creator: 'Lubasi Sinyangwe', creatorId: 'C-133', type: 'Payout identity', state: 'submitted', submitted: '3 Oct, 16:44', documents: ['NRC scan (front)'], waiting: 'Waiting more than 24h' },
];

export type ModRow = BaseRow & {
  kind: string; content: string; reporter: string; owner: string; reason: string; reported: string; previousReports: number; evidence: string[];
};
export const moderationSeed: ModRow[] = [
  { id: 'M-81', kind: 'Copyright complaint', content: '“Lusaka Rooftops” — photography listing', reporter: 'Kappa Studios (rights holder)', owner: 'Taonga Banda', reason: 'Claim that the composition copies a 2023 commercial shoot', reported: '7 Oct', previousReports: 0, evidence: ['Side-by-side comparison supplied by reporter', 'Original RAW file request sent to creator'], state: 'action-required' },
  { id: 'M-79', kind: 'Artwork report', content: '“Untitled (Study)” — painting listing', reporter: 'Buyer account', owner: 'New applicant', reason: 'Suspected AI-generated work listed as hand-painted', reported: '6 Oct', previousReports: 1, evidence: ['Two buyer messages noting texture inconsistencies'], state: 'under-review' },
  { id: 'M-78', kind: 'Review report', content: 'Review on “Copper Voices”', reporter: 'Creator (Chimwemwe Zulu)', owner: 'James Phiri', reason: 'Review contains personal contact details', reported: '5 Oct', previousReports: 0, evidence: ['Screenshot of the review'], state: 'reported' },
  { id: 'M-76', kind: 'Profile report', content: 'Creator profile — “Urban Prints Co.”', reporter: 'Buyer account', owner: 'Urban Prints Co.', reason: 'Reselling works without creator rights', reported: '4 Oct', previousReports: 3, evidence: ['Three prior reports', 'Watermarked listings compared with originals'], state: 'action-required' },
  { id: 'M-74', kind: 'Prohibited content', content: 'Service listing — “Same-day mural, no questions asked”', reporter: 'Automated filter', owner: 'Konda Decor', reason: 'Listing implies unlicensed commercial work', reported: '3 Oct', previousReports: 0, evidence: ['Listing copy snapshot'], state: 'reported' },
  { id: 'M-72', kind: 'Message report', content: 'Direct message thread #4482', reporter: 'Customer', owner: 'Unknown buyer', reason: 'Off-platform payment request', reported: '2 Oct', previousReports: 0, evidence: ['Message excerpt (metadata only — support role required for content)'], state: 'resolved' },
];

// ---------------- Read-only operational views ----------------
export type PaymentRow = { id: string; provider: string; amount: number; fee: number; platformFee: number; creatorAllocation: number; refunded: number; state: string; customer: string; linked: string; linkedKind: string; date: string; settlement: string; issue?: string };
export const paymentSeed: PaymentRow[] = [
  { id: 'PM-1094', provider: 'Airtel Money', amount: 12500, fee: 250, platformFee: 1500, creatorAllocation: 10750, refunded: 0, state: 'paid', customer: 'Kabwe Hamaundu', linked: 'O-3301', linkedKind: 'Order', date: '2 Oct, 14:22', settlement: 'Settled 3 Oct', issue: 'Settled K12,500 against an order of K12,000 — K500 over' },
  { id: 'PM-1091', provider: 'Card (Visa)', amount: 4800, fee: 144, platformFee: 576, creatorAllocation: 4080, refunded: 0, state: 'paid', customer: 'Sarah Banda', linked: 'O-3308', linkedKind: 'Order', date: '6 Oct, 11:05', settlement: 'Settled 7 Oct' },
  { id: 'PM-1088', provider: 'MTN MoMo', amount: 1750, fee: 35, platformFee: 210, creatorAllocation: 1505, refunded: 0, state: 'paid', customer: 'Nawa Chishimba', linked: 'O-3311', linkedKind: 'Order', date: '7 Oct, 09:41', settlement: 'Settling today' },
  { id: 'PM-1085', provider: 'Airtel Money', amount: 24600, fee: 492, platformFee: 2952, creatorAllocation: 21156, refunded: 0, state: 'paid', customer: 'Latitude Hotel', linked: 'Hotel Lobby Mural', linkedKind: 'Project', date: '4 Oct, 10:12', settlement: 'Settled 5 Oct' },
  { id: 'PM-1079', provider: 'Card (Visa)', amount: 2100, fee: 63, platformFee: 252, creatorAllocation: 1785, refunded: 2100, state: 'refunded', customer: 'Sarah Banda', linked: 'O-3290', linkedKind: 'Order', date: '26 Sep, 18:30', settlement: 'Refund processing' },
  { id: 'PM-1071', provider: 'MTN MoMo', amount: 3200, fee: 64, platformFee: 384, creatorAllocation: 2752, refunded: 0, state: 'failed', customer: 'Nawa Chishimba', linked: 'O-3276', linkedKind: 'Order', date: '21 Sep, 12:15', settlement: 'Not settled' },
  { id: 'PM-1068', provider: 'Card (Mastercard)', amount: 900, fee: 27, platformFee: 108, creatorAllocation: 765, refunded: 0, state: 'chargeback', customer: 'Mutale Nkomo', linked: 'O-3295', linkedKind: 'Order', date: '29 Sep, 20:12', settlement: 'Chargeback raised 6 Oct' },
];

export type WalletRow = { id: string; creator: string; creatorId: string; pending: number; available: number; onHold: number; lastPayout: string; verification: string };
export const walletSeed: WalletRow[] = [
  { id: 'W-71', creator: 'Mwansa Chileshe', creatorId: 'C-101', pending: 6800, available: 1200, onHold: 41000, lastPayout: '8 Oct · failed', verification: 'Verified' },
  { id: 'W-72', creator: 'Chanda Mulenga', creatorId: 'U-2214', pending: 0, available: 3100, onHold: 0, lastPayout: '7 Oct · processing', verification: 'Verified' },
  { id: 'W-73', creator: 'Taonga Banda', creatorId: 'C-114', pending: 2400, available: 12800, onHold: 3200, lastPayout: '1 Oct · paid', verification: 'Payout identity pending' },
  { id: 'W-74', creator: 'Mwamba Kapwepwe', creatorId: 'C-140', pending: 5400, available: 3100, onHold: 0, lastPayout: '6 Oct · on hold', verification: 'Under review' },
  { id: 'W-75', creator: 'Chimwemwe Zulu', creatorId: 'C-127', pending: 0, available: 0, onHold: 0, lastPayout: '5 Oct · paid', verification: 'Verified' },
];

export const walletLedger: Record<string, { id: string; type: string; amount: number; source: string; date: string; state: string; related: string; actor?: string }[]> = {
  'W-71': [
    { id: 'L-9041', type: 'Sale', amount: 4080, source: 'Order O-3308', date: '6 Oct', state: 'pending', related: 'PM-1091' },
    { id: 'L-9036', type: 'Milestone payment', amount: 12300, source: 'Hotel Lobby Mural', date: '4 Oct', state: 'held', related: 'PM-1085' },
    { id: 'L-9030', type: 'Payout', amount: -8200, source: 'Payout P-322', date: '8 Oct', state: 'reversed', related: 'AMP-88213' },
    { id: 'L-9029', type: 'Payout reversal', amount: 8200, source: 'Failed payout P-322', date: '8 Oct', state: 'posted', related: 'AMP-88213' },
    { id: 'L-9021', type: 'Platform fee', amount: -576, source: 'Order O-3308', date: '6 Oct', state: 'posted', related: 'PM-1091' },
    { id: 'L-9014', type: 'Hold', amount: -24600, source: 'Dispute D-104', date: '6 Oct', state: 'posted', related: 'D-104', actor: 'System' },
  ],
  'W-73': [
    { id: 'L-9039', type: 'Sale', amount: 1505, source: 'Order O-3311', date: '7 Oct', state: 'pending', related: 'PM-1088' },
    { id: 'L-9033', type: 'Hold', amount: -3200, source: 'Refund review R-55', date: '30 Sep', state: 'posted', related: 'R-55' },
    { id: 'L-9025', type: 'Payout', amount: -12400, source: 'Payout P-315', date: '1 Oct', state: 'posted', related: 'BNK-54980' },
  ],
};

export type BookingRow = { id: string; service: string; creator: string; customer: string; when: string; deposit: number; payment: string; policy: string; state: string; issue?: string };
export const bookingSeed: BookingRow[] = [
  { id: 'B-88', service: 'Portrait sitting (2h)', creator: 'Taonga Banda', customer: 'Mutale Nkomo', when: '9 Oct, 10:00', deposit: 500, payment: 'Deposit paid', policy: 'Free reschedule > 48h before', state: 'reschedule-requested', issue: 'Customer asked to move to 13 Oct' },
  { id: 'B-87', service: 'Mural site consultation', creator: 'Mwansa Chileshe', customer: 'Latitude Hotel', when: '10 Oct, 14:00', deposit: 850, payment: 'Deposit paid', policy: '50% deposit, 7-day cancellation', state: 'confirmed' },
  { id: 'B-86', service: 'Portfolio review call', creator: 'Chanda Mulenga', customer: 'Nawa Chishimba', when: '8 Oct, 16:30', deposit: 0, payment: 'No deposit', policy: 'Free cancellation', state: 'no-show' },
  { id: 'B-85', service: 'Commission walk-through', creator: 'Chimwemwe Zulu', customer: 'Kabwe Hamaundu', when: '2 Oct, 11:00', deposit: 400, payment: 'Deposit paid', policy: '50% deposit, 7-day cancellation', state: 'completed' },
  { id: 'B-84', service: 'Portrait sitting (2h)', creator: 'Taonga Banda', customer: 'Sarah Banda', when: '1 Oct, 09:00', deposit: 500, payment: 'Deposit paid', policy: 'Free reschedule > 48h before', state: 'cancelled', issue: 'Cancelled 12h before · deposit forfeit declined by admin' },
];

export type ServiceRow = { id: string; title: string; creator: string; category: string; pricing: string; availability: string; state: string; orders: number; reports: number };
export const serviceSeed: ServiceRow[] = [
  { id: 'SV-41', title: 'Custom portrait commissions', creator: 'Mwansa Chileshe', category: 'Commissions', pricing: 'From K6,500', availability: 'Booking 3 weeks out', state: 'published', orders: 12, reports: 0 },
  { id: 'SV-44', title: 'Same-day mural, no questions asked', creator: 'Konda Decor', category: 'Murals', pricing: 'From K3,000', availability: 'Immediate', state: 'hidden', orders: 0, reports: 1 },
  { id: 'SV-45', title: 'Photography sittings', creator: 'Taonga Banda', category: 'Sessions', pricing: 'K850 per hour', availability: 'Weekdays', state: 'published', orders: 8, reports: 0 },
  { id: 'SV-47', title: 'Fabric printing workshops', creator: 'Lubasi Sinyangwe', category: 'Workshops', pricing: 'K400 per seat', availability: 'Suspended with account', state: 'hidden', orders: 5, reports: 0 },
];

export const collectionSeed = [
  { id: 'COL-1', title: 'Quiet Places', works: 12, curator: 'Chewe M., Curator', state: 'published', updated: '6 Oct' },
  { id: 'COL-2', title: 'New Voices', works: 8, curator: 'Chewe M., Curator', state: 'published', updated: '1 Oct' },
  { id: 'COL-3', title: 'Contemporary Zambia', works: 24, curator: 'George M., Super Admin', state: 'scheduled', updated: 'Scheduled 12 Oct' },
  { id: 'COL-4', title: 'Works under K5,000', works: 31, curator: 'Auto rule', state: 'published', updated: 'Daily' },
  { id: 'COL-5', title: 'Large Works', works: 9, curator: 'Chewe M., Curator', state: 'draft', updated: '28 Sep' },
];

export const broadcastSeed = [
  { id: 'BC-12', audience: 'Creators', channel: 'In-app + email', title: 'Payout schedule change in November', body: 'Weekly payouts move to every Tuesday and Friday from 4 November.', scheduled: '10 Oct, 09:00', state: 'scheduled' },
  { id: 'BC-11', audience: 'Customers', channel: 'In-app', title: 'New collection: Quiet Places', body: 'Twelve calm works for rooms that breathe.', scheduled: '6 Oct, 09:00', state: 'sent' },
  { id: 'BC-10', audience: 'Everyone', channel: 'Email', title: 'Scheduled maintenance', body: 'Checkout is unavailable on Sunday 02:00–03:00.', scheduled: '1 Oct, 08:00', state: 'sent' },
];

export const adminAlerts = [
  { id: 'AN-9', label: 'High-value refund awaiting approval', detail: 'R-58 · K4,800', to: '/admin/refunds/R-58', at: '2h ago' },
  { id: 'AN-8', label: 'Failed payout needs retry', detail: 'P-322 · K8,200', to: '/admin/payouts/P-322', at: '5h ago' },
  { id: 'AN-7', label: 'New dispute opened', detail: 'D-104 · K41,000 held', to: '/admin/disputes/D-104', at: 'Yesterday' },
  { id: 'AN-6', label: 'Payment reconciliation problem', detail: 'PM-1094 · K500 over-settled', to: '/admin/payments/PM-1094', at: 'Yesterday' },
  { id: 'AN-5', label: 'Verification backlog', detail: '2 cases waiting over 24h', to: '/admin/verification', at: '2 days ago' },
];

// ---------------- Settings ----------------
export const feeSettings = [
  { label: 'Artwork platform fee', value: '12%', updated: '1 Sep 2026' },
  { label: 'Service platform fee', value: '10%', updated: '1 Sep 2026' },
  { label: 'Commission fee', value: '12%', updated: '1 Sep 2026' },
  { label: 'Booking fee', value: '8%', updated: '1 Sep 2026' },
  { label: 'Payout fee', value: 'K5 flat', updated: '1 Sep 2026' },
];

export const providerSettings = [
  { provider: 'Mobile money (MTN · Airtel)', status: 'Live', environment: 'Production', methods: 'Collections, payouts' },
  { provider: 'Card payments', status: 'Live', environment: 'Production', methods: 'Visa, Mastercard' },
  { provider: 'Bank transfer', status: 'Live', environment: 'Production', methods: 'Payouts' },
];

export const settingsGroups = [
  { id: 'marketplace', label: 'Marketplace', detail: 'Listing rules, categories, join flow' },
  { id: 'fees', label: 'Fees', detail: 'Platform and payout fees, versioned changes' },
  { id: 'payments', label: 'Payments', detail: 'Providers, environments, supported methods' },
  { id: 'payouts', label: 'Payouts', detail: 'Schedules, holds, retry policy' },
  { id: 'delivery', label: 'Delivery', detail: 'Couriers, packaging, collection rules' },
  { id: 'commission-rules', label: 'Commission rules', detail: 'Deposits, milestones, revision windows' },
  { id: 'booking-rules', label: 'Booking rules', detail: 'Cancellation windows, no-show handling' },
  { id: 'verification', label: 'Verification', detail: 'Identity, payout identity, business checks' },
  { id: 'notifications', label: 'Notifications', detail: 'Operational and broadcast templates' },
  { id: 'moderation', label: 'Moderation', detail: 'Report categories, appeal windows' },
  { id: 'feature-flags', label: 'Feature flags', detail: 'Gradual rollouts and kill switches' },
];

export const featureFlags = [
  { flag: 'Art for Spaces (B2B)', state: 'On', rollout: 'Everyone' },
  { flag: 'Fractional collections', state: 'Off', rollout: '—' },
  { flag: 'Instant payouts', state: 'Beta', rollout: '20% of verified creators' },
];

// ---------------- Search index helper ----------------
export const searchIndex: { group: string; label: string; sub: string; to: string }[] = [
  ...userSeed.map((u) => ({ group: 'Users', label: u.name, sub: `${u.id} · ${u.email} · ${u.phone}`, to: `/admin/users/${u.id}` })),
  ...creatorSeed.map((c) => ({ group: 'Creators', label: c.name, sub: `${c.id} · ${c.discipline}`, to: `/admin/creators/${c.id}` })),
  ...orderSeed.map((o) => ({ group: 'Orders', label: `${o.id} · ${o.artwork}`, sub: `${o.buyer} · ${money(o.total)}`, to: `/admin/orders/${o.id}` })),
  ...paymentSeed.map((p) => ({ group: 'Payments', label: `${p.id} · ${money(p.amount)}`, sub: `${p.customer} · ${p.provider}`, to: `/admin/payments/${p.id}` })),
  ...workSeed.map((w) => ({ group: 'Works', label: w.title, sub: `${w.id} · ${w.artist}`, to: `/admin/works/${w.id}` })),
  ...disputeSeed.map((d) => ({ group: 'Disputes', label: `${d.id} · ${d.title}`, sub: `${money(d.amount)} · ${d.state.replaceAll('-', ' ')}`, to: `/admin/disputes/${d.id}` })),
  ...workSeed.filter((w) => w.certificate === 'Issued').map((w) => ({ group: 'Certificates', label: `CERT-${w.id} · ${w.title}`, sub: `Certificate of authenticity · ${w.artist}`, to: `/admin/works/${w.id}` })),
  ...serviceSeed.map((v) => ({ group: 'Services', label: `${v.id} · ${v.title}`, sub: v.creator, to: `/admin/services/${v.id}` })),
  ...bookingSeed.map((b) => ({ group: 'Bookings', label: `${b.id} · ${b.service}`, sub: `${b.creator} → ${b.customer} · ${b.when}`, to: `/admin/bookings/${b.id}` })),
  ...payoutSeed.map((p) => ({ group: 'Payouts', label: `${p.id} · ${money(p.amount)}`, sub: `${p.creator} · ${p.state.replaceAll('-', ' ')}`, to: `/admin/payouts/${p.id}` })),
];
