import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/creators')({ head: () => pageHead('Creators', 'Creator status, verification and earnings.', true), component: CreatorsQueue });

function CreatorsQueue() {
  const creators = useAdminOps((s) => s.creators);
  const [tab, setTab] = useState('all');
  const [ver, setVer] = useState('all');
  const tabs = [
    { value: 'all', label: 'All', count: creators.length },
    { value: 'active', label: 'Active', count: creators.filter((c) => c.state === 'active').length },
    { value: 'under-review', label: 'Under review', count: creators.filter((c) => c.state === 'under-review').length },
    { value: 'paused', label: 'Paused', count: creators.filter((c) => c.state === 'paused').length },
    { value: 'suspended', label: 'Suspended', count: creators.filter((c) => c.state === 'suspended').length },
  ];
  const rows = creators.filter((c) => (tab === 'all' || c.state === tab) && (ver === 'all' || (ver === 'ok' ? c.payoutVerification === 'Verified' : c.payoutVerification !== 'Verified')));
  return (
    <AdminPage title="Creators">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Payout verification" value={ver} onChange={setVer} options={[
          { value: 'all', label: 'All verification states' }, { value: 'ok', label: 'Verified' }, { value: 'blocked', label: 'Not verified' },
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Creator', render: (c) => <div><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">{c.id} · {c.discipline}</p></div> },
          { key: 'works', label: 'Works', render: (c) => `${c.works} works · ${c.services} services` },
          { key: 'activeProjects', label: 'Projects', render: (c) => `${c.activeProjects} active · ${c.completedProjects} done` },
          { key: 'sales', label: 'Sales', render: (c) => money(c.sales) },
          { key: 'payoutVerification', label: 'Payout verification' },
          { key: 'state', label: 'Status', render: (c) => <StatusPill state={c.state} /> },
        ]}
        rows={rows}
        hrefFor={(c) => `/admin/creators/${c.id}`}
        emptyTitle="No creators match these filters."
      />
      <p className="text-sm text-muted-foreground">Operational status (active, paused, suspended) is kept separate from payout verification state.</p>
    </AdminPage>
  );
}
