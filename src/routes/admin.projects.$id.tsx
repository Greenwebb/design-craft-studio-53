import { createFileRoute, Link } from '@tanstack/react-router';
import { ActionsPanel, AuditTrail, InternalNotes, AdminPage, Fact, FactGrid, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { projectMilestones } from '@/data/workflows';
import { sharedConversations } from '@/data/ecosystem';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/projects/$id')({
  head: () => pageHead('Project', 'Project operations detail.', true),
  component: ProjectAdminView,
});

function ProjectAdminView() {
  const { id } = Route.useParams();
  const project = useAdminOps((s) => s.projects.find((p) => p.id === id));
  if (!project) return <AdminPage title="Project"><p className="text-muted-foreground">This project is no longer available.</p></AdminPage>;
  const dispute = project.id === 'hotel-lobby-mural' ? 'D-104' : undefined;
  const messages = sharedConversations.find((c) => c.projectId === id)?.messages ?? [];
  return (
    <AdminPage title={project.title} back>
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill state={project.state} />
        {dispute && <Link to="/admin/disputes/$id" params={{ id: dispute }} className="inline-flex items-center gap-1.5 rounded-full bg-studio-copper/10 px-3 py-1 text-[13px] font-medium text-studio-copper">Dispute {dispute} open</Link>}
        <span className="text-[15px] text-muted-foreground">Source: {project.source}</span>
      </div>
      <SectionCard title="Overview">
        <FactGrid cols={4}>
          <Fact label="Customer">{project.customer}</Fact>
          <Fact label="Creator">{project.creator}</Fact>
          <Fact label="Agreed amount">{money(project.agreed)}</Fact>
          <Fact label="Paid in">{money(project.paidIn)}</Fact>
          <Fact label="Next action" className="sm:col-span-2">{project.next}</Fact>
          <Fact label="Dispute state">{dispute ? 'Under review · funds held' : 'None'}</Fact>
        </FactGrid>
      </SectionCard>
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Milestones">
          <ol className="space-y-3">
            {projectMilestones.map((m, i) => (
              <li key={m.title} className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${i <= 1 ? 'bg-studio-green text-paper' : 'border border-border text-muted-foreground'}`}>{i + 1}</span>
                <div><p className="font-medium">{m.title}</p><p className="text-sm text-muted-foreground">{m.amount} · {m.share} · {m.state.replaceAll('-', ' ')}</p></div>
              </li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard title="Messages metadata">
          {messages.length ? (
            <ul className="space-y-3 text-[15px]">
              {messages.map((m) => <li key={m.id}><p className="font-medium">{m.author} <span className="text-sm text-muted-foreground">· {m.time}</span></p><p className="mt-0.5 text-muted-foreground">{m.body.length > 90 ? `${m.body.slice(0, 90)}…` : m.body}</p></li>)}
            </ul>
          ) : <p className="text-[15px] text-muted-foreground">No messages yet.</p>}
          <p className="mt-4 text-sm text-muted-foreground">Full conversation content is visible only to authorized support roles.</p>
        </SectionCard>
      </div>
      <ActionsPanel resource="projects" record={project} />
      <InternalNotes resource="projects" record={project} />
      <AuditTrail resource="projects" id={project.id} />
    </AdminPage>
  );
}
