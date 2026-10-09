import { createFileRoute } from '@tanstack/react-router';
import { ActionsPanel, AdminPage, AuditTrail, Fact, FactGrid, InternalNotes, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { StageTracker } from '@/components/ecosystem/workflow';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { works } from '@/data/works';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/spaces/$id')({ head: ({ params }) => pageHead(`Enquiry ${params.id}`, 'Art for Spaces enquiry detail.', true), component: SpaceDetail });

const stages = [
  { id: 'new', label: 'New', detail: 'Enquiry received', owner: 'platform' as const }, { id: 'curating', label: 'Curating', detail: 'Shortlist in progress', owner: 'platform' as const },
  { id: 'proposal-sent', label: 'Proposal sent', detail: 'Client reviewing', owner: 'customer' as const },
  { id: 'accepted', label: 'Accepted', detail: 'Orders created', owner: 'platform' as const }, { id: 'installed', label: 'Installed', detail: 'Works on the wall', owner: 'platform' as const },
];

function SpaceDetail() {
  const { id } = Route.useParams();
  const r = useAdminOps((s) => s.spaces.find((x) => x.id === id));
  if (!r) return <AdminPage title="Enquiry not found" back><p className="text-muted-foreground">No enquiry with ID {id}.</p></AdminPage>;
  const current = Math.max(0, stages.findIndex((s) => s.id === r.state));
  return (
    <AdminPage title={r.client} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={r.state} /><span className="text-[15px] text-muted-foreground">{r.id} · received {r.received}</span></div>
      {r.state !== 'closed' && <StageTracker stages={stages} current={current} label="Enquiry progress" />}
      <SectionCard title="Brief">
        <p className="text-[15px]">{r.brief}</p>
        <div className="mt-5"><FactGrid><Fact label="Space">{r.space}</Fact><Fact label="City">{r.city}</Fact><Fact label="Budget">{money(r.budget)}</Fact><Fact label="Curator">{r.curator}</Fact></FactGrid></div>
      </SectionCard>
      <SectionCard title={`Shortlist · ${r.shortlist} works`}>
        {r.shortlist ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {works.slice(0, Math.min(6, r.shortlist)).map((w) => <img key={w.id} src={w.image} alt={w.title} loading="lazy" className="aspect-square rounded-lg object-cover" />)}
          </div>
        ) : <p className="text-[15px] text-muted-foreground">No works shortlisted yet. Assign a curator to start.</p>}
      </SectionCard>
      <ActionsPanel resource="spaces" record={r} />
      <InternalNotes resource="spaces" record={r} />
      <AuditTrail resource="spaces" id={r.id} />
    </AdminPage>
  );
}
