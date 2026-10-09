import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/moderation')({ head: () => pageHead('Moderation', 'Reports, copyright complaints and prohibited content.', true), component: ModerationQueue });

function ModerationQueue() {
  const moderation = useAdminOps((s) => s.moderation);
  const [tab, setTab] = useState('all');
  const [kind, setKind] = useState('all');
  const counts = (s: string) => moderation.filter((m) => m.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: moderation.length },
    { value: 'reported', label: 'Reported', count: counts('reported') },
    { value: 'under-review', label: 'Under review', count: counts('under-review') },
    { value: 'action-required', label: 'Action required', count: counts('action-required') },
    { value: 'removed', label: 'Removed', count: counts('removed') },
    { value: 'escalated', label: 'Escalated', count: counts('escalated') },
    { value: 'resolved', label: 'Resolved', count: counts('resolved') },
  ];
  const kinds = [...new Set(moderation.map((m) => m.kind))];
  const rows = moderation.filter((m) => (tab === 'all' || m.state === tab) && (kind === 'all' || m.kind === kind));
  return (
    <AdminPage title="Moderation">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Report type" value={kind} onChange={setKind} options={[
          { value: 'all', label: 'All types' }, ...kinds.map((k) => ({ value: k, label: k })),
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Case', render: (m) => <div><p className="font-medium">{m.id} · {m.content}</p><p className="text-sm text-muted-foreground">{m.kind} · reported by {m.reporter}</p></div> },
          { key: 'owner', label: 'Owner' },
          { key: 'previousReports', label: 'History', render: (m) => m.previousReports > 0 ? `${m.previousReports} previous` : 'First report' },
          { key: 'reported', label: 'Reported' },
          { key: 'state', label: 'Status', render: (m) => <StatusPill state={m.state} /> },
        ]}
        rows={rows as never}
        hrefFor={(m) => `/admin/moderation/${m.id}`}
        emptyTitle="No reports match these filters."
        emptyDetail="The moderation queue is clear."
      />
      <p className="text-sm text-muted-foreground">Content is hidden first, not deleted — moderation state stays recoverable for appeals. Copyright decisions follow a dedicated, auditable workflow.</p>
    </AdminPage>
  );
}
