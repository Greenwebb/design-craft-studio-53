import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/orders')({ head: () => pageHead('Orders', 'Artwork order operations across every status.', true), component: OrdersQueue });

const states = ['payment-pending', 'paid', 'creator-confirmation', 'preparing', 'ready', 'dispatched', 'in-transit', 'delivered', 'completed', 'cancelled', 'delivery-issue', 'disputed'];

function OrdersQueue() {
  const orders = useAdminOps((s) => s.orders);
  const [tab, setTab] = useState('all');
  const [flagged, setFlagged] = useState('all');
  const counts = (s: string) => orders.filter((o) => o.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: orders.length },
    { value: 'issues', label: 'Issues', count: orders.filter((o) => ['delivery-issue', 'disputed', 'cancelled'].includes(o.state)).length },
    ...states.filter((s) => counts(s) > 0).map((s) => ({ value: s, label: s.replaceAll('-', ' '), count: counts(s) })),
  ];
  const rows = orders.filter((o) => {
    const tabOk = tab === 'all' || (tab === 'issues' ? ['delivery-issue', 'disputed', 'cancelled'].includes(o.state) : o.state === tab);
    const flagOk = flagged === 'all' || (flagged === 'flagged' ? !!o.issue : !o.issue);
    return tabOk && flagOk;
  });
  return (
    <AdminPage title="Orders">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Issue flag" value={flagged} onChange={setFlagged} options={[
          { value: 'all', label: 'All orders' }, { value: 'flagged', label: 'Flagged issues only' }, { value: 'clear', label: 'No issues' },
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Order', render: (o) => <div><p className="font-medium">{o.id} · {o.artwork}</p><p className="text-sm text-muted-foreground">{o.buyer} → {o.creator}</p></div> },
          { key: 'total', label: 'Total', render: (o) => money(o.total) },
          { key: 'delivery', label: 'Delivery' },
          { key: 'payment', label: 'Payment' },
          { key: 'placed', label: 'Placed' },
          { key: 'state', label: 'Status', render: (o) => <div className="flex flex-col items-start gap-1.5"><StatusPill state={o.state} />{o.issue && <span className="text-[13px] text-studio-danger">{o.issue}</span>}</div> },
        ]}
        rows={rows}
        hrefFor={(o) => `/admin/orders/${o.id}`}
        emptyTitle="No orders match these filters."
      />
    </AdminPage>
  );
}
