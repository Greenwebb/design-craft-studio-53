import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/payouts/')({ head: () => pageHead('Payouts', 'Payout queue with approvals, holds and retries.', true), component: PayoutsQueue });

function PayoutsQueue() {
  const payouts = useAdminOps((s) => s.payouts);
  const [tab, setTab] = useState('all');
  const [method, setMethod] = useState('all');
  const counts = (s: string) => payouts.filter((p) => p.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: payouts.length },
    { value: 'needs-review', label: 'Needs review', count: payouts.filter((p) => ['requested', 'failed', 'on-hold'].includes(p.state)).length },
    ...['requested', 'processing', 'paid', 'failed', 'on-hold', 'cancelled'].filter((s) => counts(s) > 0).map((s) => ({ value: s, label: s.replaceAll('-', ' '), count: counts(s) })),
  ];
  const rows = payouts.filter((p) => (tab === 'all' || (tab === 'needs-review' ? ['requested', 'failed', 'on-hold'].includes(p.state) : p.state === tab)) && (method === 'all' || (method === 'momo' ? p.method.includes('Money') || p.method.includes('MoMo') : p.method.includes('bank'))));
  return (
    <AdminPage title="Payouts">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Method" value={method} onChange={setMethod} options={[
          { value: 'all', label: 'All methods' }, { value: 'momo', label: 'Mobile money' }, { value: 'bank', label: 'Bank transfer' },
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Payout', render: (p) => <div><p className="font-medium">{p.id}</p><p className="text-sm text-muted-foreground">{p.creator} · {p.requested}</p></div> },
          { key: 'amount', label: 'Amount', render: (p) => money(p.amount) },
          { key: 'method', label: 'Method' },
          { key: 'verification', label: 'Verification', render: (p) => p.verification === 'Verified' ? 'Verified' : <span className="text-studio-copper">{p.verification}</span> },
          { key: 'state', label: 'Status', render: (p) => <div className="flex flex-col items-start gap-1.5"><StatusPill state={p.state} />{p.failureReason && <span className="max-w-56 text-[13px] text-studio-danger">{p.failureReason}</span>}</div> },
        ]}
        rows={rows}
        hrefFor={(p) => `/admin/payouts/${p.id}`}
        emptyTitle="No payouts require review."
        emptyDetail="You're all caught up."
      />
    </AdminPage>
  );
}
