import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/spaces/')({ head: () => pageHead('Art for Spaces', 'Business enquiries, shortlists and installations.', true), component: SpacesQueue });

const stages = ['new', 'curating', 'proposal-sent', 'accepted', 'installed', 'closed'];

function SpacesQueue() {
  const rows = useAdminOps((s) => s.spaces);
  const [tab, setTab] = useState('all');
  return (
    <AdminPage title="Art for Spaces">
      <FilterTabs value={tab} onChange={setTab} options={[{ value: 'all', label: 'All', count: rows.length }, ...stages.map((s) => ({ value: s, label: s.replaceAll('-', ' '), count: rows.filter((r) => r.state === s).length })).filter((o) => o.count)]} />
      <AdminTable
        columns={[
          { key: 'client', label: 'Client', render: (r) => <div><p className="font-medium">{r.client}</p><p className="text-sm text-muted-foreground">{r.id} · {r.space}</p></div> },
          { key: 'city', label: 'City' },
          { key: 'budget', label: 'Budget', render: (r) => money(r.budget) },
          { key: 'curator', label: 'Curator' },
          { key: 'shortlist', label: 'Shortlist', render: (r) => `${r.shortlist} works` },
          { key: 'state', label: 'Stage', render: (r) => <StatusPill state={r.state} /> },
        ]}
        rows={rows.filter((r) => tab === 'all' || r.state === tab)}
        hrefFor={(r) => `/admin/spaces/${r.id}`}
        emptyTitle="No enquiries at this stage."
      />
    </AdminPage>
  );
}
