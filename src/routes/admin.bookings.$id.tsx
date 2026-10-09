import { createFileRoute } from '@tanstack/react-router';
import { ActionsPanel, InternalNotes, AdminPage, AuditTrail, Fact, FactGrid, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/bookings/$id')({
  head: ({ params }) => pageHead(`Booking ${params.id}`, 'Booking detail, deposit and cancellation policy.', true),
  component: BookingDetail,
});

function BookingDetail() {
  const { id } = Route.useParams();
  const b = useAdminOps((st) => st.bookings.find((x) => x.id === id));
  if (!b) {
    return <AdminPage title="Booking not found" back><p className="text-[15px] text-muted-foreground">No booking with ID {id}. Search with Ctrl+K.</p></AdminPage>;
  }
  return (
    <AdminPage title={`${b.id} · ${b.service}`} back>
      <div className="flex flex-wrap items-center gap-3"><StatusPill state={b.state} /><span className="text-[15px] text-muted-foreground">{b.creator} → {b.customer}</span></div>
      {b.issue && <p className="rounded-xl border border-studio-danger/30 p-4 text-[15px] text-studio-danger">{b.issue}</p>}
      <SectionCard title="Booking">
        <FactGrid>
          <Fact label="Date & time">{b.when}</Fact>
          <Fact label="Deposit">{b.deposit ? money(b.deposit) : 'None'}</Fact>
          <Fact label="Payment">{b.payment}</Fact>
          <Fact label="Policy">{b.policy}</Fact>
        </FactGrid>
      </SectionCard>
      <ActionsPanel resource="bookings" record={b} />
      <InternalNotes resource="bookings" record={b} />
      <AuditTrail resource="bookings" id={b.id} seeded={[{ at: 'Booked', what: `${b.customer} booked ${b.service}` }]} />
    </AdminPage>
  );
}
