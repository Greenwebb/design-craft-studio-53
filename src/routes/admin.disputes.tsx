import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money, priorityMeta } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/disputes')({ head: () => pageHead('Disputes', 'Case management for orders and projects.', true), component: DisputesQueue });

function DisputesQueue() {
  const disputes = useAdminOps((s) => s.disputes);
  const [tab, setTab] = useState('all');
  const [priority, setPriority] = useState('all');
  const counts = (s: string) => disputes.filter((d) => d.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: disputes.length },
    { value: 'open', label: 'Open', count: counts('open') },
    { value: 'awaiting-customer', label: 'Awaiting customer', count: counts('awaiting-customer') },
    { value: 'awaiting-creator', label: 'Awaiting creator', count: counts('awaiting-creator') },
    { value: 'under-review', label: 'Under review', count: counts('under-review') },
    { value: 'escalated', label: 'Escalated', count: counts('escalated') },
    { value: 'resolved', label: 'Resolved', count: counts('resolved') },
    { value: 'closed', label: 'Closed', count: counts('closed') },
  ];
  const rows = disputes.filter((d) => (tab === 'all' || d.state === tab) && (priority === 'all' || d.priority === priority));
  return (
    <AdminPage title="Disputes">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Priority" value={priority} onChange={setPriority} options={[
          { value: 'all', label: 'All priorities' },
          ...(['critical', 'high', 'normal', 'low'] as const).map((p) => ({ value: p, label: priorityMeta[p].label })),
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Case', render: (d) => <div><p className="font-medium">{d.id} · {d.title}</p><p className="text-sm text-muted-foreground">{d.customer} ↔ {d.creator}</p></div> },
          { key: 'type', label: 'Type' },
          { key: 'amount', label: 'Amount', render: (d) => <span className={d.fundsHeld ? 'font-medium text-studio-copper' : ''}>{money(d.amount)}{d.fundsHeld ? ' held' : ''}</span> },
          { key: 'opened', label: 'Opened' },
          { key: 'priority', label: 'Priority', render: (d) => <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${priorityMeta[d.priority].className}`}>{priorityMeta[d.priority].label}</span> },
          { key: 'state', label: 'Status', render: (d) => <StatusPill state={d.state} /> },
        ]}
        rows={rows}
        hrefFor={(d) => `/admin/disputes/${d.id}`}
        emptyTitle="No disputes match these filters."
      />
    </AdminPage>
  );
}
