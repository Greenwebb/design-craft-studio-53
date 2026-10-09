import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/users/')({ head: () => pageHead('Users', 'Every account on the marketplace.', true), component: UsersQueue });

function UsersQueue() {
  const users = useAdminOps((s) => s.users);
  const [tab, setTab] = useState('all');
  const [kind, setKind] = useState('all');
  const tabs = [
    { value: 'all', label: 'All', count: users.length },
    { value: 'active', label: 'Active', count: users.filter((u) => u.state === 'active').length },
    { value: 'suspended', label: 'Suspended', count: users.filter((u) => u.state === 'suspended').length },
    { value: 'deactivated', label: 'Deactivated', count: users.filter((u) => u.state === 'deactivated').length },
  ];
  const rows = users.filter((u) => (tab === 'all' || u.state === tab) && (kind === 'all' || u.kind.includes(kind)));
  return (
    <AdminPage title="Users">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Account type" value={kind} onChange={setKind} options={[
          { value: 'all', label: 'All types' }, { value: 'Customer', label: 'Customers' }, { value: 'Creator', label: 'Has creator account' },
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'User', render: (u) => <div><p className="font-medium">{u.name}</p><p className="text-sm text-muted-foreground">{u.id} · {u.email}</p></div> },
          { key: 'kind', label: 'Type' },
          { key: 'verification', label: 'Verification' },
          { key: 'joined', label: 'Joined' },
          { key: 'lastActive', label: 'Last active' },
          { key: 'state', label: 'Status', render: (u) => <StatusPill state={u.state} /> },
        ]}
        rows={rows}
        hrefFor={(u) => `/admin/users/${u.id}`}
        emptyTitle="No accounts match these filters."
        emptyDetail="Try clearing the status or account type filter."
      />
    </AdminPage>
  );
}
