import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/works')({ head: () => pageHead('Works', 'Marketplace listings and their moderation state.', true), component: WorksQueue });

function WorksQueue() {
  const works = useAdminOps((s) => s.works);
  const [tab, setTab] = useState('all');
  const [mod, setMod] = useState('all');
  const tabs = [
    { value: 'all', label: 'All', count: works.length },
    { value: 'published', label: 'Published', count: works.filter((w) => w.state === 'published').length },
    { value: 'sold', label: 'Sold', count: works.filter((w) => w.state === 'sold').length },
    { value: 'reserved', label: 'Reserved', count: works.filter((w) => w.state === 'reserved').length },
    { value: 'reported', label: 'Reported', count: works.filter((w) => w.state === 'reported').length },
    { value: 'under-review', label: 'Under review', count: works.filter((w) => w.state === 'under-review').length },
    { value: 'hidden', label: 'Hidden', count: works.filter((w) => w.state === 'hidden').length },
  ];
  const rows = works.filter((w) => (tab === 'all' || w.state === tab) && (mod === 'all' || (mod === 'flagged' ? w.reports > 0 : w.reports === 0)));
  return (
    <AdminPage title="Works">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Moderation" value={mod} onChange={setMod} options={[
          { value: 'all', label: 'All moderation states' }, { value: 'flagged', label: 'Has reports' }, { value: 'clear', label: 'No reports' },
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'title', label: 'Work', render: (w) => <div><p className="font-medium">{w.title}</p><p className="text-sm text-muted-foreground">{w.id} · {w.artist}</p></div> },
          { key: 'type', label: 'Type' },
          { key: 'price', label: 'Price', render: (w) => money(w.price) },
          { key: 'edition', label: 'Edition' },
          { key: 'moderation', label: 'Moderation', render: (w) => w.reports > 0 ? <span className="font-medium text-studio-copper">{w.moderation} · {w.reports}</span> : 'Clear' },
          { key: 'state', label: 'Status', render: (w) => <StatusPill state={w.state} /> },
        ]}
        rows={rows}
        hrefFor={(w) => `/admin/works/${w.id}`}
        emptyTitle="No listings match these filters."
      />
    </AdminPage>
  );
}
