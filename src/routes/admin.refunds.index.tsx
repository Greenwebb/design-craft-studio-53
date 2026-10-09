import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/refunds/')({ head: () => pageHead('Refunds', 'Refund requests, approvals and their financial impact.', true), component: RefundsQueue });

function RefundsQueue() {
  const refunds = useAdminOps((s) => s.refunds);
  const [tab, setTab] = useState('all');
  const counts = (s: string) => refunds.filter((r) => r.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: refunds.length },
    { value: 'requested', label: 'Requested', count: counts('requested') },
    { value: 'under-review', label: 'Under review', count: counts('under-review') },
    { value: 'processing', label: 'Processing', count: counts('processing') },
    { value: 'refunded', label: 'Refunded', count: counts('refunded') },
    { value: 'rejected', label: 'Rejected', count: counts('rejected') },
  ];
  const rows = refunds.filter((r) => tab === 'all' || r.state === tab);
  return (
    <AdminPage title="Refunds">
      <FilterTabs options={tabs} value={tab} onChange={setTab} />
      <AdminTable
        columns={[
          { key: 'id', label: 'Refund', render: (r) => <div><p className="font-medium">{r.id} · {r.artwork}</p><p className="text-sm text-muted-foreground">Order {r.order} · {r.customer}</p></div> },
          { key: 'amount', label: 'Amount', render: (r) => money(r.amount) },
          { key: 'reason', label: 'Reason' },
          { key: 'requester', label: 'Requested by', render: (r) => `${r.requester} · ${r.requested}` },
          { key: 'state', label: 'Status', render: (r) => <StatusPill state={r.state} /> },
        ]}
        rows={rows}
        hrefFor={(r) => `/admin/refunds/${r.id}`}
        emptyTitle="No refunds in this queue."
        emptyDetail="You're all caught up."
      />
    </AdminPage>
  );
}
