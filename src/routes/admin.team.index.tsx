import { createFileRoute, Link } from '@tanstack/react-router';
import { Copy, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, Field } from '@/components/admin/admin-account';
import { AdminDialog, AdminPage, AdminTable, FilterTabs, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { roleOf, useAdminTeam } from '@/stores/admin-team';

export const Route = createFileRoute('/admin/team/')({ component: TeamList });

const departments = ['Operations', 'Finance', 'Support', 'Trust & Safety', 'Marketplace'];

function TeamList() {
  const { staff, roles, invitations, invite, invitation } = useAdminTeam();
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ email: '', name: '', roleId: 'support', department: 'Support' });
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const dup = staff.some((s) => s.email === f.email) || invitations.some((i) => i.email === f.email && i.state === 'pending');
  const send = () => { invite(f); setOpen(false); setF({ email: '', name: '', roleId: 'support', department: 'Support' }); toast.success(`Invitation sent to ${f.email}`); };
  const rows = staff.filter((s) => tab === 'all' || s.state === tab).map((s) => ({ ...s, role: roleOf(roles, s.roleId)?.label ?? '' }));
  return (
    <AdminPage title="Team" actions={<button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-ink-foreground"><Plus size={18} />Invite</button>}>
      <p className="max-w-2xl text-[15px] text-muted-foreground">Staff with access to operations. These are not marketplace accounts.</p>
      <FilterTabs value={tab} onChange={setTab} options={[{ value: 'all', label: 'All', count: staff.length }, ...(['active', 'suspended', 'deactivated'] as const).map((s) => ({ value: s, label: s, count: staff.filter((x) => x.state === s).length }))]} />
      <AdminTable
        columns={[
          { key: 'name', label: 'Staff member', render: (s) => <div className="flex items-center gap-3"><Avatar name={s.name} size={36} /><div><p className="font-medium">{s.name}</p><p className="text-sm text-muted-foreground">{s.email}</p></div></div> },
          { key: 'role', label: 'Role' }, { key: 'department', label: 'Department' },
          { key: 'lastLogin', label: 'Last login' }, { key: 'invitedBy', label: 'Invited by', render: (s) => <span>{s.invitedBy}<br /><span className="text-sm text-muted-foreground">{s.invited}</span></span> },
          { key: 'state', label: 'Status', render: (s) => <StatusPill state={s.state} /> },
        ]}
        rows={rows} hrefFor={(s) => `/admin/team/${s.id}`} emptyTitle="No staff in this state."
      />
      <SectionCard title="Invitations">
        <ul className="divide-y divide-border">
          {invitations.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-3 py-4">
              <div className="min-w-0 flex-1"><p className="font-medium">{i.name} · {i.email}</p><p className="text-sm text-muted-foreground">{roleOf(roles, i.roleId)?.label} · {i.department} · sent {i.sent}</p></div>
              <StatusPill state={i.state} />
              {(i.state === 'pending' || i.state === 'expired') && <button type="button" onClick={() => { invitation(i.id, 'resend'); toast.success('Invitation resent'); }} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">Resend</button>}
              {i.state === 'pending' && <>
                <button type="button" onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}/admin/invite/${i.token}`); toast.success('Invite link copied'); }} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"><Copy size={15} />Copy link</button>
                <Link to="/admin/invite/$token" params={{ token: i.token }} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">Preview</Link>
                <button type="button" onClick={() => invitation(i.id, 'revoke')} className="rounded-full border border-studio-danger/40 px-4 py-2 text-sm font-medium text-studio-danger">Revoke</button>
              </>}
            </li>
          ))}
        </ul>
      </SectionCard>
      <AdminDialog open={open} onOpenChange={setOpen} title="Invite team member" description="They'll get a secure link to set their own password. No initial passwords are set by admins.">
        <div className="space-y-4">
          <Field label="Work email"><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value.trim() })} className="studio-input" /></Field>
          {dup && <p className="text-sm text-studio-danger">This person already has access or a pending invitation.</p>}
          <Field label="Full name"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="studio-input" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role"><select value={f.roleId} onChange={(e) => setF({ ...f, roleId: e.target.value })} className="studio-input">{roles.filter((r) => !r.archived).map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></Field>
            <Field label="Department"><select value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} className="studio-input">{departments.map((d) => <option key={d}>{d}</option>)}</select></Field>
          </div>
          <p className="text-sm text-muted-foreground">{roleOf(roles, f.roleId)?.description}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary">Cancel</button>
            <button type="button" disabled={!validEmail || dup || f.name.trim().length < 2} onClick={send} className="rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Send invitation</button>
          </div>
        </div>
      </AdminDialog>
    </AdminPage>
  );
}
