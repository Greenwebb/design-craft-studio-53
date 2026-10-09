import { Link } from '@tanstack/react-router';
import { AlertTriangle, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { AdminPage, ActionsPanel, AdminTable, AuditTrail, Fact, FactGrid, InternalNotes, SectionCard, StatusPill, ThreadSection } from './admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { money, paymentSeed, priorityMeta, walletLedger, walletSeed, type BaseRow } from '@/data/admin-data';

const NotFound = ({ title }: { title: string }) => (
  <AdminPage title={title}><p className="text-muted-foreground">This record is no longer available.</p></AdminPage>
);

function Trail(props: { resource: string; id: string }) {
  return <div className="studio-panel p-6 sm:p-7"><AuditTrail {...props} /></div>;
}

export function UserDetail({ id }: { id: string }) {
  const user = useAdminOps((s) => s.users.find((u) => u.id === id));
  if (!user) return <NotFound title="User" />;
  return (
    <AdminPage title={user.name} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={user.state} /><span className="text-[15px] text-muted-foreground">{user.id} · {user.kind}</span></div>
      <SectionCard title="Account">
        <FactGrid>
          <Fact label="Email">{user.email}</Fact>
          <Fact label="Phone">{user.phone}</Fact>
          <Fact label="Verification">{user.verification}</Fact>
          <Fact label="Two-step verification">{user.twoFactor ? 'On' : 'Off'}</Fact>
          <Fact label="Joined">{user.joined}</Fact>
          <Fact label="Last active">{user.lastActive}</Fact>
        </FactGrid>
      </SectionCard>
      <SectionCard title="Activity summary">
        <FactGrid>
          <Fact label="Orders">{user.orders}</Fact>
          <Fact label="Projects">{user.projects}</Fact>
          <Fact label="Disputes">{user.disputes}</Fact>
          <Fact label="Lifetime spend">{money(user.spend)}</Fact>
        </FactGrid>
      </SectionCard>
      <ActionsPanel resource="users" record={user} />
      <InternalNotes resource="users" record={user} />
      <Trail resource="users" id={user.id} />
    </AdminPage>
  );
}

export function CreatorDetail({ id }: { id: string }) {
  const creator = useAdminOps((s) => s.creators.find((c) => c.id === id));
  if (!creator) return <NotFound title="Creator" />;
  return (
    <AdminPage title={creator.name} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={creator.state} /><span className="text-[15px] text-muted-foreground">{creator.id} · {creator.discipline}</span></div>
      <SectionCard title="Creator status" aside={<Link to="/admin/creators" className="text-sm font-medium text-studio-green">All creators<ArrowUpRight size={16} className="inline" /></Link>}>
        <FactGrid>
          <Fact label="Operational status">{creator.state.replaceAll('-', ' ')}</Fact>
          <Fact label="Payout verification">{creator.payoutVerification}</Fact>
          <Fact label="Works">{creator.works}</Fact>
          <Fact label="Services">{creator.services}</Fact>
          <Fact label="Active projects">{creator.activeProjects}</Fact>
          <Fact label="Completed projects">{creator.completedProjects}</Fact>
          <Fact label="Lifetime sales">{money(creator.sales)}</Fact>
          <Fact label="Reports · disputes">{creator.reports} · {creator.disputes}</Fact>
        </FactGrid>
        <p className="mt-5 text-sm text-muted-foreground">Operational status is separate from payout verification — one can be healthy while the other is blocked.</p>
      </SectionCard>
      <SectionCard title="Earnings & wallet">
        <FactGrid>
          <Fact label="Pending balance">{money(creator.pending)}</Fact>
          <Fact label="Available balance">{money(creator.available)}</Fact>
          <Fact label="Last payout">{creator.lastPayout}</Fact>
        </FactGrid>
        <p className="mt-5 text-sm text-muted-foreground">Balances are ledger-only. Corrections happen through payouts, refunds and reversals — never by editing a balance.</p>
      </SectionCard>
      <ActionsPanel resource="users" record={{ ...creator, state: creator.state === 'under-review' || creator.state === 'paused' ? 'active' : creator.state } as BaseRow} />
      <InternalNotes resource="users" record={creator} />
      <Trail resource="users" id={creator.id} />
    </AdminPage>
  );
}

export function WorkDetail({ id }: { id: string }) {
  const work = useAdminOps((s) => s.works.find((w) => w.id === id));
  if (!work) return <NotFound title="Work" />;
  return (
    <AdminPage title={work.title} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={work.state} /><span className="text-[15px] text-muted-foreground">{work.id} · {work.type}</span></div>
      <SectionCard title="Listing">
        <FactGrid>
          <Fact label="Artist">{work.artist}</Fact>
          <Fact label="Price">{money(work.price)}</Fact>
          <Fact label="Edition">{work.edition}</Fact>
          <Fact label="Moderation state">{work.moderation}</Fact>
          <Fact label="Reports">{work.reports}</Fact>
          <Fact label="Certificate">{work.certificate}</Fact>
        </FactGrid>
        <p className="mt-5 text-sm text-muted-foreground">Creator-owned content is not edited here. Moderation actions (hide, flag, restore) keep the original listing intact and recoverable.</p>
      </SectionCard>
      <ActionsPanel resource="works" record={work} />
      <InternalNotes resource="works" record={work} />
      <Trail resource="works" id={work.id} />
    </AdminPage>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const order = useAdminOps((s) => s.orders.find((o) => o.id === id));
  const disputes = useAdminOps((s) => s.disputes);
  const refunds = useAdminOps((s) => s.refunds);
  if (!order) return <NotFound title="Order" />;
  const linkedDisputes = disputes.filter((d) => d.linked === order.id);
  const linkedRefunds = refunds.filter((r) => r.order === order.id);
  return (
    <AdminPage title={`Order ${order.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={order.state} />{order.issue && <span className="inline-flex items-center gap-1.5 rounded-full bg-studio-danger/10 px-3 py-1 text-[13px] font-medium text-studio-danger"><AlertTriangle size={16} aria-hidden />{order.issue}</span>}</div>
      <SectionCard title="Order summary">
        <FactGrid>
          <Fact label="Artwork"><Link to="/admin/works/$id" params={{ id: order.workId }} className="text-studio-green underline-offset-4 hover:underline">{order.artwork}</Link></Fact>
          <Fact label="Buyer"><Link to="/admin/users/$id" params={{ id: order.buyerId }} className="text-studio-green underline-offset-4 hover:underline">{order.buyer}</Link></Fact>
          <Fact label="Creator"><Link to="/admin/creators/$id" params={{ id: order.creatorId }} className="text-studio-green underline-offset-4 hover:underline">{order.creator}</Link></Fact>
          <Fact label="Total">{money(order.total)}</Fact>
          <Fact label="Payment">{order.payment}</Fact>
          <Fact label="Delivery">{order.delivery}</Fact>
          <Fact label="Placed">{order.placed}</Fact>
          <Fact label="Certificate">{order.state === 'completed' ? 'Issued' : 'On completion'}</Fact>
        </FactGrid>
      </SectionCard>
      {(linkedDisputes.length > 0 || linkedRefunds.length > 0) && (
        <SectionCard title="Linked cases">
          <ul className="space-y-2 text-[15px]">
            {linkedDisputes.map((d) => <li key={d.id}><Link to="/admin/disputes/$id" params={{ id: d.id }} className="text-studio-green underline-offset-4 hover:underline">Dispute {d.id}</Link> · {d.title}</li>)}
            {linkedRefunds.map((r) => <li key={r.id}><Link to="/admin/refunds/$id" params={{ id: r.id }} className="text-studio-green underline-offset-4 hover:underline">Refund {r.id}</Link> · {r.reason}</li>)}
          </ul>
        </SectionCard>
      )}
      <ActionsPanel resource="orders" record={order} />
      <InternalNotes resource="orders" record={order} />
      <Trail resource="orders" id={order.id} />
    </AdminPage>
  );
}

export function PayoutDetail({ id }: { id: string }) {
  const payout = useAdminOps((s) => s.payouts.find((p) => p.id === id));
  if (!payout) return <NotFound title="Payout" />;
  return (
    <AdminPage title={`Payout ${payout.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={payout.state} /><span className="text-[15px] text-muted-foreground">{money(payout.amount)} · {payout.creator}</span></div>
      {payout.state === 'failed' && (
        <div className="rounded-xl border border-studio-danger/30 bg-studio-danger/6 p-5">
          <p className="font-medium text-studio-danger">Payout failed</p>
          <p className="mt-1 text-[15px]">Reason: {payout.failureReason}</p>
          <p className="mt-1 text-[15px]">{payout.fundsRestored ? 'Funds were returned to the available balance — no money is missing.' : 'Funds state not confirmed yet.'}</p>
        </div>
      )}
      <SectionCard title="Payout detail">
        <FactGrid>
          <Fact label="Creator"><Link to="/admin/creators/$id" params={{ id: payout.creatorId }} className="text-studio-green underline-offset-4 hover:underline">{payout.creator}</Link></Fact>
          <Fact label="Amount">{money(payout.amount)}</Fact>
          <Fact label="Method">{payout.method}</Fact>
          <Fact label="Wallet"><Link to="/admin/wallets/$id" params={{ id: payout.wallet }} className="text-studio-green underline-offset-4 hover:underline">{payout.wallet}</Link></Fact>
          <Fact label="Verification">{payout.verification}</Fact>
          <Fact label="Requested">{payout.requested}</Fact>
          <Fact label="Provider reference">{payout.providerRef ?? 'Not yet assigned'}</Fact>
        </FactGrid>
      </SectionCard>
      <ActionsPanel resource="payouts" record={payout} />
      <InternalNotes resource="payouts" record={payout} />
      <Trail resource="payouts" id={payout.id} />
    </AdminPage>
  );
}

export function RefundDetail({ id }: { id: string }) {
  const refund = useAdminOps((s) => s.refunds.find((r) => r.id === id));
  if (!refund) return <NotFound title="Refund" />;
  return (
    <AdminPage title={`Refund ${refund.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={refund.state} /><span className="text-[15px] text-muted-foreground">{money(refund.amount)} · {refund.artwork}</span></div>
      <SectionCard title="Refund detail">
        <FactGrid>
          <Fact label="Original order"><Link to="/admin/orders/$id" params={{ id: refund.order }} className="text-studio-green underline-offset-4 hover:underline">{refund.order}</Link></Fact>
          <Fact label="Amount">{money(refund.amount)}</Fact>
          <Fact label="Customer">{refund.customer}</Fact>
          <Fact label="Creator">{refund.creator}</Fact>
          <Fact label="Reason">{refund.reason}</Fact>
          <Fact label="Requested by">{refund.requester} · {refund.requested}</Fact>
          <Fact label="Evidence" className="sm:col-span-2 lg:col-span-4">{refund.evidence ?? 'None supplied yet'}</Fact>
        </FactGrid>
        <p className="mt-5 text-sm text-muted-foreground">Wallet impact on approval: creator earnings reverse, the platform fee returns, and the customer is refunded. Nothing moves until an authorized approver confirms.</p>
      </SectionCard>
      <ActionsPanel resource="refunds" record={refund} />
      <InternalNotes resource="refunds" record={refund} />
      <Trail resource="refunds" id={refund.id} />
    </AdminPage>
  );
}

export function DisputeDetail({ id }: { id: string }) {
  const dispute = useAdminOps((s) => s.disputes.find((d) => d.id === id));
  if (!dispute) return <NotFound title="Dispute" />;
  return (
    <AdminPage title={`Dispute ${dispute.id}`} back>
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill state={dispute.state} />
        {dispute.fundsHeld && <span className="inline-flex items-center gap-1.5 rounded-full bg-studio-copper/10 px-3 py-1 text-[13px] font-medium text-studio-copper"><ShieldAlert size={16} aria-hidden />{dispute.paymentState}</span>}
      </div>
      <SectionCard title="Case summary">
        <FactGrid cols={3}>
          <Fact label="Type">{dispute.type}</Fact>
          <Fact label="Amount at risk">{money(dispute.amount)}</Fact>
          <Fact label="Opened">{dispute.opened}</Fact>
          <Fact label="Customer">{dispute.customer}</Fact>
          <Fact label="Creator">{dispute.creator}</Fact>
          <Fact label="Linked">{dispute.linkedKind} · {dispute.linked}</Fact>
        </FactGrid>
      </SectionCard>
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Customer position"><p className="text-[15px] leading-relaxed">{dispute.customerPosition}</p></SectionCard>
        <SectionCard title="Creator position"><p className="text-[15px] leading-relaxed">{dispute.creatorPosition}</p></SectionCard>
      </div>
      <SectionCard title="Evidence">
        <ul className="space-y-2 text-[15px]">{dispute.evidence.map((e) => <li key={e} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-green" aria-hidden />{e}</li>)}</ul>
      </SectionCard>
      <ActionsPanel resource="disputes" record={dispute as unknown as BaseRow} />
      <ThreadSection resource="disputes" id={dispute.id} thread={dispute.thread} replyAs="Operations" />
      <InternalNotes resource="disputes" record={dispute as unknown as BaseRow} />
      <Trail resource="disputes" id={dispute.id} />
    </AdminPage>
  );
}

export function SupportDetail({ id }: { id: string }) {
  const item = useAdminOps((s) => s.support.find((c) => c.id === id));
  if (!item) return <NotFound title="Support case" />;
  return (
    <AdminPage title={`Case ${item.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={item.state} /><span className="text-[15px] text-muted-foreground">{item.subject}</span></div>
      <SectionCard title="Case detail">
        <FactGrid>
          <Fact label="Source">{item.source}</Fact>
          <Fact label="Customer">{item.customer}</Fact>
          {item.creator && <Fact label="Creator">{item.creator}</Fact>}
          <Fact label="Linked resource">{item.linked}</Fact>
          <Fact label="Opened">{item.opened}</Fact>
          <Fact label="Assigned to">{item.assignedTo ?? 'Unassigned'}</Fact>
          <Fact label="SLA / age">{item.sla}</Fact>
        </FactGrid>
      </SectionCard>
      <ActionsPanel resource="support" record={item as unknown as BaseRow} />
      <ThreadSection resource="support" id={item.id} thread={item.thread} replyAs="Support" />
      <InternalNotes resource="support" record={item as unknown as BaseRow} />
      <Trail resource="support" id={item.id} />
    </AdminPage>
  );
}

export function VerificationDetail({ id }: { id: string }) {
  const item = useAdminOps((s) => s.verification.find((v) => v.id === id));
  if (!item) return <NotFound title="Verification" />;
  return (
    <AdminPage title={`Verification ${item.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={item.state} /><span className="text-[15px] text-muted-foreground">{item.type} · {item.creator}</span></div>
      <SectionCard title="Submission">
        <FactGrid>
          <Fact label="Creator">{item.creator}</Fact>
          <Fact label="Type">{item.type}</Fact>
          <Fact label="Submitted">{item.submitted}</Fact>
          <Fact label="Documents"><ul className="space-y-1">{item.documents.map((d) => <li key={d}>{d}</li>)}</ul></Fact>
          {item.waiting && <Fact label="Previous note" className="sm:col-span-2">{item.waiting}</Fact>}
        </FactGrid>
      </SectionCard>
      <ActionsPanel resource="verification" record={item as unknown as BaseRow} />
      <InternalNotes resource="verification" record={item as unknown as BaseRow} />
      <Trail resource="verification" id={item.id} />
    </AdminPage>
  );
}

export function ModerationDetail({ id }: { id: string }) {
  const item = useAdminOps((s) => s.moderation.find((m) => m.id === id));
  if (!item) return <NotFound title="Moderation case" />;
  return (
    <AdminPage title={`Moderation ${item.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={item.state} /><span className="text-[15px] text-muted-foreground">{item.kind}</span></div>
      <SectionCard title="Reported content">
        <FactGrid cols={3}>
          <Fact label="Content">{item.content}</Fact>
          <Fact label="Owner">{item.owner}</Fact>
          <Fact label="Reporter">{item.reporter}</Fact>
          <Fact label="Reason" className="sm:col-span-2">{item.reason}</Fact>
          <Fact label="Previous reports">{item.previousReports}</Fact>
        </FactGrid>
      </SectionCard>
      <SectionCard title="Evidence">
        <ul className="space-y-2 text-[15px]">{item.evidence.map((e) => <li key={e} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-studio-green" aria-hidden />{e}</li>)}</ul>
        <p className="mt-4 text-sm text-muted-foreground">Decisions are recoverable — content is hidden first, not deleted, unless policy requires removal.</p>
      </SectionCard>
      <ActionsPanel resource="moderation" record={item as unknown as BaseRow} />
      <InternalNotes resource="moderation" record={item as unknown as BaseRow} />
      <Trail resource="moderation" id={item.id} />
    </AdminPage>
  );
}

// ---------- read-only financial views ----------
export function PaymentDetail({ id }: { id: string }) {
  const payment = paymentSeed.find((p) => p.id === id);
  if (!payment) return <NotFound title="Payment" />;
  const net = payment.amount - payment.fee - payment.platformFee - payment.refunded;
  return (
    <AdminPage title={`Payment ${payment.id}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={payment.state} />{payment.issue && <span className="inline-flex items-center gap-1.5 rounded-full bg-studio-danger/10 px-3 py-1 text-[13px] font-medium text-studio-danger"><AlertTriangle size={16} aria-hidden />{payment.issue}</span>}</div>
      <SectionCard title="Financial breakdown" aside={<span className="text-sm text-muted-foreground">Immutable record</span>}>
        <FactGrid>
          <Fact label="Gross amount">{money(payment.amount)}</Fact>
          <Fact label="Processing fee">{money(payment.fee)}</Fact>
          <Fact label="Platform fee">{money(payment.platformFee)}</Fact>
          <Fact label="Creator allocation">{money(payment.creatorAllocation)}</Fact>
          <Fact label="Refunded amount">{money(payment.refunded)}</Fact>
          <Fact label="Net platform amount">{money(net)}</Fact>
        </FactGrid>
        <p className="mt-5 text-sm text-muted-foreground">Historical payment values are never edited. Corrections happen as reversals or adjustments, each with its own audit entry.</p>
      </SectionCard>
      <SectionCard title="Links">
        <FactGrid>
          <Fact label="Customer">{payment.customer}</Fact>
          <Fact label="Linked">{payment.linkedKind === 'Order' ? <Link to="/admin/orders/$id" params={{ id: payment.linked }} className="text-studio-green underline-offset-4 hover:underline">{payment.linked}</Link> : payment.linked}</Fact>
          <Fact label="Provider">{payment.provider}</Fact>
          <Fact label="Settlement">{payment.settlement}</Fact>
        </FactGrid>
      </SectionCard>
    </AdminPage>
  );
}

export function WalletDetail({ id }: { id: string }) {
  const wallet = walletSeed.find((w) => w.id === id);
  if (!wallet) return <NotFound title="Wallet" />;
  const ledger = walletLedger[wallet.id] ?? [];
  return (
    <AdminPage title={`Wallet ${wallet.id}`} back>
      <SectionCard title="Balances" aside={<Link to="/admin/creators/$id" params={{ id: wallet.creatorId }} className="text-sm font-medium text-studio-green">{wallet.creator}<ArrowUpRight size={16} className="inline" /></Link>}>
        <FactGrid cols={4}>
          <Fact label="Pending">{money(wallet.pending)}</Fact>
          <Fact label="Available">{money(wallet.available)}</Fact>
          <Fact label="On hold">{money(wallet.onHold)}</Fact>
          <Fact label="Payout verification">{wallet.verification}</Fact>
        </FactGrid>
        <p className="mt-5 text-sm text-muted-foreground">Balances move only through ledger transactions — sales, fees, holds, releases, refunds, reversals and payouts. Admin cannot type a new balance.</p>
      </SectionCard>
      <SectionCard title="Transaction ledger">
        <AdminTable
          columns={[
            { key: 'id', label: 'Transaction', render: (r) => <span className="font-medium">{String(r.id)}</span> },
            { key: 'type', label: 'Type' },
            { key: 'amount', label: 'Amount', render: (r) => <span className={Number(r.amount) < 0 ? 'text-studio-danger' : ''}>{money(Number(r.amount))}</span> },
            { key: 'source', label: 'Source' },
            { key: 'date', label: 'Date' },
            { key: 'state', label: 'State', render: (r) => <StatusPill state={String(r.state)} /> },
          ]}
          rows={ledger}
          hrefFor={() => `/admin/wallets/${wallet.id}`}
          emptyTitle="No ledger entries."
          emptyDetail="Balances appear once sales or payouts are recorded."
        />
        {ledger.some((l) => l.actor) && <p className="mt-4 text-sm text-muted-foreground">Manual entries show the acting staff member and are audit-logged.</p>}
      </SectionCard>
    </AdminPage>
  );
}
