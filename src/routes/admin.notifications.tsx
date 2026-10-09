import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ActionsPanel, AdminDialog, AdminPage, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { adminAlerts } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/notifications')({ head: () => pageHead('Notifications', 'Internal alerts and controlled broadcasts.', true), component: NotificationsAdmin });

const audiences = ['Everyone', 'Customers', 'Creators', 'Verified creators'];
const channels = ['In-app', 'Email', 'In-app + email'];

function NotificationsAdmin() {
  const broadcasts = useAdminOps((s) => s.broadcasts);
  const create = useAdminOps((s) => s.create);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', body: '', audience: audiences[1]!, channel: channels[0]!, scheduled: '' });
  const valid = f.title.trim().length > 3 && f.body.trim().length > 5 && f.scheduled;
  const save = () => {
    create('broadcasts', { id: `BC-${13 + broadcasts.length}`, ...f, scheduled: f.scheduled.replace('T', ', '), state: 'draft' });
    setF({ title: '', body: '', audience: audiences[1]!, channel: channels[0]!, scheduled: '' }); setOpen(false);
  };
  return (
    <AdminPage title="Notifications">
      <section>
        <h2 className="text-2xl font-semibold">Internal alerts</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Operational events that need a staff member — not broadcast messages.</p>
        <ul className="mt-5 space-y-3">
          {adminAlerts.map((a) => (
            <li key={a.id}>
              <Link to={a.to} className="studio-panel studio-hover flex items-center justify-between gap-4 bg-background p-5">
                <div><p className="font-medium">{a.label}</p><p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p></div>
                <span className="shrink-0 text-sm text-muted-foreground">{a.at}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <SectionCard title="Broadcasts" aside={<button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-[15px] font-medium text-ink-foreground"><Plus size={17} />New broadcast</button>}>
        <div className="space-y-3">
          {broadcasts.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-background p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-medium">{b.title}</p><p className="mt-0.5 text-sm text-muted-foreground">{b.audience} · {b.channel} · {b.scheduled}</p></div>
                <StatusPill state={b.state} />
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">{b.body}</p>
              <ActionsPanel resource="broadcasts" record={b} className="mt-4" />
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">New broadcasts start as drafts and need approval before sending.</p>
      </SectionCard>
      <AdminDialog open={open} onOpenChange={setOpen} title="New broadcast" description="Saved as a draft for review.">
        <div className="space-y-4">
          <label className="block"><span className="text-sm font-medium">Title</span><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="studio-input mt-2" /></label>
          <label className="block"><span className="text-sm font-medium">Message</span><textarea value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} rows={3} className="studio-input mt-2 resize-none" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="text-sm font-medium">Audience</span><select value={f.audience} onChange={(e) => setF({ ...f, audience: e.target.value })} className="studio-input mt-2">{audiences.map((a) => <option key={a}>{a}</option>)}</select></label>
            <label className="block"><span className="text-sm font-medium">Channel</span><select value={f.channel} onChange={(e) => setF({ ...f, channel: e.target.value })} className="studio-input mt-2">{channels.map((a) => <option key={a}>{a}</option>)}</select></label>
          </div>
          <label className="block"><span className="text-sm font-medium">Send at</span><input type="datetime-local" value={f.scheduled} onChange={(e) => setF({ ...f, scheduled: e.target.value })} className="studio-input mt-2" /></label>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary">Cancel</button>
            <button type="button" disabled={!valid} onClick={save} className="rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Save draft</button>
          </div>
        </div>
      </AdminDialog>
    </AdminPage>
  );
}
