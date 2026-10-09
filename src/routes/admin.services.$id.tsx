import { createFileRoute } from '@tanstack/react-router';
import { ActionsPanel, InternalNotes, AdminPage, AuditTrail, Fact, FactGrid, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/services/$id')({
  head: ({ params }) => pageHead(`Service ${params.id}`, 'Service listing detail, pricing and reports.', true),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { id } = Route.useParams();
  const s = useAdminOps((st) => st.services.find((x) => x.id === id));
  if (!s) {
    return <AdminPage title="Service not found" back><p className="text-[15px] text-muted-foreground">No service with ID {id}. It may have been removed — search with Ctrl+K.</p></AdminPage>;
  }
  return (
    <AdminPage title={s.title} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={s.state} /><span className="text-[15px] text-muted-foreground">{s.id} · {s.creator}</span></div>
      <SectionCard title="Listing">
        <FactGrid>
          <Fact label="Category">{s.category}</Fact>
          <Fact label="Pricing">{s.pricing}</Fact>
          <Fact label="Availability">{s.availability}</Fact>
          <Fact label="Orders">{s.orders}</Fact>
        </FactGrid>
      </SectionCard>
      <SectionCard title="Reports">
        <p className="text-[15px] text-muted-foreground">{s.reports ? `${s.reports} open report${s.reports > 1 ? 's' : ''} — review in Moderation before restoring.` : 'No reports on this service.'}</p>
      </SectionCard>
      <ActionsPanel resource="services" record={s} />
      <InternalNotes resource="services" record={s} />
      <AuditTrail resource="services" id={s.id} seeded={[{ at: 'Listed', what: `Service published by ${s.creator}` }]} />
    </AdminPage>
  );
}
