import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/bookings/')({ head: () => pageHead('Bookings', 'Service bookings, deposits and cancellations.', true), component: BookingsQueue });

function BookingsQueue() {
  const [tab, setTab] = useState('all');
  const bookingSeed = useAdminOps((s) => s.bookings);
  const counts = (s: string) => bookingSeed.filter((b) => b.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: bookingSeed.length },
    { value: 'issues', label: 'Issues', count: bookingSeed.filter((b) => b.issue).length },
    ...['requested', 'pending-confirmation', 'confirmed', 'reschedule-requested', 'completed', 'cancelled', 'no-show', 'disputed'].filter((s) => counts(s) > 0).map((s) => ({ value: s, label: s.replaceAll('-', ' '), count: counts(s) })),
  ];
  const rows = bookingSeed.filter((b) => tab === 'all' || (tab === 'issues' ? !!b.issue : b.state === tab));
  return (
    <AdminPage title="Bookings">
      <FilterTabs options={tabs} value={tab} onChange={setTab} />
      <AdminTable
        columns={[
          { key: 'id', label: 'Booking', render: (b) => <div><p className="font-medium">{b.id} · {b.service}</p><p className="text-sm text-muted-foreground">{b.creator} → {b.customer}</p></div> },
          { key: 'when', label: 'Date & time' },
          { key: 'deposit', label: 'Deposit', render: (b) => b.deposit ? money(b.deposit) : 'None' },
          { key: 'payment', label: 'Payment' },
          { key: 'policy', label: 'Policy' },
          { key: 'state', label: 'Status', render: (b) => <div className="flex flex-col items-start gap-1.5"><StatusPill state={b.state} />{b.issue && <span className="text-[13px] text-studio-danger">{b.issue}</span>}</div> },
        ]}
        rows={rows}
        hrefFor={(b) => `/admin/bookings/${b.id}`}
        emptyTitle="No bookings match this filter."
      />
      <p className="text-sm text-muted-foreground">Cancellation windows and no-show deposits follow the booking rules configured in Settings.</p>
    </AdminPage>
  );
}
