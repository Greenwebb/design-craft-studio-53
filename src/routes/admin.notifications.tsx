import { createFileRoute, Link } from '@tanstack/react-router';
import { AdminPage, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { adminAlerts, broadcastSeed } from '@/data/admin-data';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/notifications')({ head: () => pageHead('Notifications', 'Internal alerts and controlled broadcasts.', true), component: NotificationsAdmin });

function NotificationsAdmin() {
  return (
    <AdminPage title="Notifications">
      <section>
        <h2 className="text-2xl font-semibold">Internal alerts</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Operational events that need a staff member — not broadcast messages.</p>
        <ul className="mt-5 space-y-3">
          {adminAlerts.map((a) => (
            <li key={a.id}>
              <Link to={a.to} className="studio-panel studio-hover flex items-center justify-between gap-4 p-5">
                <div><p className="font-medium">{a.label}</p><p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p></div>
                <span className="shrink-0 text-sm text-muted-foreground">{a.at}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <SectionCard title="Broadcasts" aside={<button className="rounded-full border border-border px-5 py-2 text-[15px] font-medium hover:bg-secondary">New broadcast</button>}>
        <div className="space-y-3">
          {broadcastSeed.map((b) => (
            <div key={b.id} className="rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-medium">{b.title}</p><p className="mt-0.5 text-sm text-muted-foreground">{b.audience} · {b.channel} · {b.scheduled}</p></div>
                <StatusPill state={b.state} />
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Broadcasts are permission-restricted: audience, channel, title, body and scheduled time are reviewed before sending. No arbitrary global sends.</p>
      </SectionCard>
    </AdminPage>
  );
}
