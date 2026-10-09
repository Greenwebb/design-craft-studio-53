import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { sharedProjects } from '@/data/ecosystem';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/projects')({ head: () => pageHead('Projects', 'Commission and service projects in operations.', true), component: ProjectsQueue });

// Operational fields kept alongside the shared project records (no duplicates).
const ops: Record<string, { agreed: number; paid: number; dispute?: string; nextAction: string }> = {
  'hotel-lobby-mural': { agreed: 41000, paid: 24600, dispute: 'D-104', nextAction: 'Operations review of the palette dispute' },
  'portrait-session': { agreed: 1700, paid: 500, nextAction: 'Session on 18 October — no operational issues' },
};

function ProjectsQueue() {
  const [tab, setTab] = useState('all');
  const awaiting = sharedProjects.filter((x) => x.status === 'awaiting-review').length;
  const tabs = [
    { value: 'all', label: 'All', count: sharedProjects.length },
    { value: 'attention', label: 'Needs attention', count: sharedProjects.filter((p) => ops[p.id]?.dispute).length },
    { value: 'awaiting-review', label: 'Awaiting review', count: awaiting },
  ];
  return (
    <AdminPage title="Projects">
      <FilterTabs options={tabs} value={tab} onChange={setTab} />
      <AdminTable
        columns={[
          { key: 'title', label: 'Project', render: (p) => <div><p className="font-medium">{p.title}</p><p className="text-sm text-muted-foreground">{p.customerName} ↔ {p.creatorName} · {p.source}</p></div> },
          { key: 'agreed', label: 'Agreed', render: (p) => money(ops[p.id]?.agreed ?? 0) },
          { key: 'paid', label: 'Paid in', render: (p) => money(ops[p.id]?.paid ?? 0) },
          { key: 'nextMilestone', label: 'Next step', render: (p) => ops[p.id]?.nextAction ?? p.nextMilestone },
          { key: 'status', label: 'Status', render: (p) => <div className="flex flex-col items-start gap-1.5"><StatusPill state={p.status} />{ops[p.id]?.dispute && <span className="text-[13px] text-studio-copper">Dispute {ops[p.id]?.dispute}</span>}</div> },
        ]}
        rows={sharedProjects.filter((p) => tab === 'all' || (tab === 'attention' ? !!ops[p.id]?.dispute : p.status === tab))}
        hrefFor={(p) => `/admin/projects/${p.id}`}
        emptyTitle="No projects match this filter."
      />
      <SectionCard title="How projects move">
        <ol className="flex flex-wrap gap-2 text-sm">
          {['Requested', 'Confirmed', 'In progress', 'Awaiting review', 'Revision', 'Awaiting payment', 'Paused', 'Completed'].map((s, i) => (
            <li key={s} className="rounded-full border border-border px-3 py-1.5">{i + 1}. {s}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">Cancelled and disputed projects leave the main flow and are handled through {<Link to="/admin/disputes" className="text-studio-green underline-offset-4 hover:underline">Disputes</Link>} and {<Link to="/admin/refunds" className="text-studio-green underline-offset-4 hover:underline">Refunds</Link>}.</p>
      </SectionCard>
    </AdminPage>
  );
}

