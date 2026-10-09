import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/support')({ head: () => pageHead('Support', 'Customer and creator support cases.', true), component: SupportQueue });

function SupportQueue() {
  const support = useAdminOps((s) => s.support);
  const [tab, setTab] = useState('all');
  const [assignee, setAssignee] = useState('all');
  const counts = (s: string) => support.filter((c) => c.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: support.length },
    { value: 'open', label: 'Open', count: counts('open') },
    { value: 'in-progress', label: 'In progress', count: counts('in-progress') },
    { value: 'waiting-customer', label: 'Waiting on customer', count: counts('waiting-customer') },
    { value: 'waiting-creator', label: 'Waiting on creator', count: counts('waiting-creator') },
    { value: 'waiting-internal', label: 'Waiting internally', count: counts('waiting-internal') },
    { value: 'resolved', label: 'Resolved', count: counts('resolved') },
    { value: 'closed', label: 'Closed', count: counts('closed') },
  ];
  const rows = support.filter((c) => (tab === 'all' || c.state === tab) && (assignee === 'all' || (assignee === 'unassigned' ? !c.assignedTo : c.assignedTo === assignee)));
  return (
    <AdminPage title="Support">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Assigned to" value={assignee} onChange={setAssignee} options={[
          { value: 'all', label: 'Everyone' }, { value: 'unassigned', label: 'Unassigned' },
          ...[...new Set(support.map((c) => c.assignedTo).filter(Boolean))].map((a) => ({ value: a as string, label: a as string })),
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Case', render: (c) => <div><p className="font-medium">{c.id} · {c.subject}</p><p className="text-sm text-muted-foreground">{c.source} · {c.customer}{c.creator ? ` ↔ ${c.creator}` : ''}</p></div> },
          { key: 'linked', label: 'Linked' },
          { key: 'opened', label: 'Opened' },
          { key: 'sla', label: 'SLA / age' },
          { key: 'assignedTo', label: 'Assigned', render: (c) => c.assignedTo ?? <span className="text-studio-copper">Unassigned</span> },
          { key: 'state', label: 'Status', render: (c) => <StatusPill state={c.state} /> },
        ]}
        rows={rows as never}
        hrefFor={(c) => `/admin/support/${c.id}`}
        emptyTitle="No cases match these filters."
        emptyDetail="Nothing is waiting on the team right now."
      />
    </AdminPage>
  );
}
