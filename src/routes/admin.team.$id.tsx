import { createFileRoute, Link } from '@tanstack/react-router';
import { Laptop, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, Field } from '@/components/admin/admin-account';
import { AdminDialog, AdminPage, AuditTrail, Fact, FactGrid, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { roleOf, useAdminTeam, type StaffState } from '@/stores/admin-team';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/team/$id')({ head: () => pageHead('Staff member', 'Staff profile, role, sessions and activity.', true), component: StaffDetail });

const tabs = ['Profile', 'Role & permissions', 'Sessions', 'Activity'] as const;
const btn = 'rounded-full px-5 py-2.5 text-[15px] font-medium';

function StaffDetail() {
  const { id } = Route.useParams();
  const { staff, roles, meId, changeRole, setState, signOutOthers } = useAdminTeam();
  const st = staff.find((s) => s.id === id);
  const [tab, setTab] = useState<(typeof tabs)[number]>('Profile');
  const [roleOpen, setRoleOpen] = useState(false);
  const [nextRole, setNextRole] = useState('');
  const [stateOpen, setStateOpen] = useState<StaffState | null>(null);
  const [reason, setReason] = useState('');
  if (!st) return <AdminPage title="Staff not found" back><p className="text-muted-foreground">No staff member with ID {id}.</p></AdminPage>;
  const role = roleOf(roles, st.roleId);
  const target = roleOf(roles, nextRole);
  const gain = target ? target.permissions.filter((p) => !role?.permissions.includes(p)) : [];
  const lose = target ? (role?.permissions ?? []).filter((p) => !target.permissions.includes(p)) : [];
  const owned = Object.entries(st.owns).filter(([, n]) => n > 0);
  const self = st.id === meId;
  const close = () => { setRoleOpen(false); setStateOpen(null); setReason(''); };
  return (
    <AdminPage title={st.name} back>
      <section className="studio-panel flex flex-col gap-5 bg-background p-6 sm:flex-row sm:items-center">
        <Avatar name={st.name} size={64} />
        <div className="flex-1"><p className="text-[15px] text-muted-foreground">{st.title || 'No title'} · {st.department}</p><div className="mt-2 flex flex-wrap gap-2"><StatusPill state={st.state} /><span className="rounded-full bg-ink px-3 py-1 text-[13px] font-medium text-ink-foreground">{role?.label}</span>{self && <span className="rounded-full bg-secondary px-3 py-1 text-[13px]">You</span>}</div></div>
      </section>
      {self ? <p className="text-[15px] text-muted-foreground">This is your account. Your own role and access can only be changed by another Super Admin. <Link to="/admin/account" className="font-medium text-studio-green">Open my account</Link></p> : (
        <div className="flex flex-wrap gap-3">
          {st.state === 'active' && <button type="button" onClick={() => { setNextRole(''); setRoleOpen(true); }} className={`${btn} bg-ink text-ink-foreground`}>Change role</button>}
          {st.state === 'active' && st.sessions.length > 0 && <button type="button" onClick={() => { signOutOthers(st.id); setState(st.id, 'active', 'Forced sign-out'); toast.success('All sessions ended'); }} className={`${btn} border border-border hover:bg-secondary`}>Force sign-out</button>}
          {st.state === 'active' && <button type="button" onClick={() => setStateOpen('suspended')} className={`${btn} border border-studio-danger/40 text-studio-danger`}>Suspend access</button>}
          {(st.state === 'suspended' || st.state === 'deactivated') && <button type="button" onClick={() => setStateOpen('active')} className={`${btn} bg-ink text-ink-foreground`}>Reactivate</button>}
          {st.state !== 'deactivated' && <button type="button" onClick={() => setStateOpen('deactivated')} className={`${btn} border border-studio-danger/40 text-studio-danger`}>Deactivate (offboard)</button>}
        </div>
      )}
      <div role="tablist" className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className={`shrink-0 rounded-full border px-5 py-2.5 text-[15px] font-medium ${tab === t ? 'border-ink bg-ink text-ink-foreground' : 'border-border hover:bg-secondary'}`}>{t}</button>)}
      </div>
      {tab === 'Profile' && <SectionCard title="Profile"><FactGrid><Fact label="Email">{st.email}</Fact><Fact label="Phone">{st.phone || 'Not added'}</Fact><Fact label="Joined">{st.joined}</Fact><Fact label="Last login">{st.lastLogin}</Fact><Fact label="Invited by">{st.invitedBy}</Fact><Fact label="Invited">{st.invited}</Fact><Fact label="Open work">{owned.length ? owned.map(([k, n]) => `${n} ${k}`).join(', ') : 'None'}</Fact></FactGrid></SectionCard>}
      {tab === 'Role & permissions' && <SectionCard title={`${role?.label} · ${role?.permissions.length} permissions`}><p className="text-[15px] text-muted-foreground">{role?.description}</p><div className="mt-4 flex flex-wrap gap-2">{role?.permissions.map((p) => <span key={p} className="rounded-full bg-secondary px-3 py-1 text-[13px]">{p}</span>)}</div></SectionCard>}
      {tab === 'Sessions' && <SectionCard title="Sessions">{st.sessions.length ? <ul className="divide-y divide-border">{st.sessions.map((s) => <li key={s.id} className="flex items-center gap-3 py-3"><Laptop size={19} /><span className="flex-1">{s.device} · {s.place}</span><span className="text-sm text-muted-foreground">{s.lastActive}</span></li>)}</ul> : <p className="text-[15px] text-muted-foreground">No active sessions.</p>}</SectionCard>}
      {tab === 'Activity' && <div className="studio-panel p-6"><AuditTrail resource="team" id={st.id} /></div>}

      <AdminDialog open={roleOpen} onOpenChange={(v) => !v && close()} title={`Change ${st.displayName}'s role`} description={`Currently ${role?.label}. They'll be notified and it's recorded in the audit log.`} wide>
        <div className="space-y-4">
          <Field label="New role"><select value={nextRole} onChange={(e) => setNextRole(e.target.value)} className="studio-input"><option value="">Choose a role…</option>{roles.filter((r) => !r.archived && r.id !== st.roleId).map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></Field>
          {target && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4"><p className="font-medium text-studio-success">Will gain ({gain.length})</p><ul className="mt-2 space-y-1 text-sm">{gain.length ? gain.map((p) => <li key={p} className="flex gap-2"><Plus size={15} className="text-studio-success" />{p}</li>) : <li className="text-muted-foreground">Nothing new</li>}</ul></div>
              <div className="rounded-xl border border-border p-4"><p className="font-medium text-studio-danger">Will lose ({lose.length})</p><ul className="mt-2 space-y-1 text-sm">{lose.length ? lose.map((p) => <li key={p} className="flex gap-2"><Minus size={15} className="text-studio-danger" />{p}</li>) : <li className="text-muted-foreground">Nothing removed</li>}</ul></div>
            </div>
          )}
          <Field label="Reason *"><textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className="studio-input resize-none" /></Field>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={close} className="rounded-full border border-border px-6 py-3 font-medium">Cancel</button>
            <button type="button" disabled={!target || reason.trim().length < 4} onClick={() => { changeRole(st.id, nextRole, reason.trim()); toast.success(`${st.displayName} is now ${target?.label}`); close(); }} className="rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Confirm role change</button>
          </div>
        </div>
      </AdminDialog>

      <AdminDialog open={!!stateOpen} onOpenChange={(v) => !v && close()} title={stateOpen === 'active' ? 'Reactivate access' : stateOpen === 'suspended' ? 'Suspend admin access' : 'Deactivate staff member'}
        description="Past actions stay in the audit log. Nothing is deleted.">
        <div className="space-y-4">
          {stateOpen !== 'active' && <ul className="space-y-1.5 rounded-xl border border-border p-4 text-[15px]"><li>• All their sessions end now</li><li>• They can't open the operations dashboard</li>{stateOpen === 'deactivated' && <li>• Their open work is returned to the team queues</li>}</ul>}
          {stateOpen === 'deactivated' && owned.length > 0 && <p className="rounded-xl border border-studio-warning/40 p-4 text-[15px]">{st.displayName} currently owns {owned.map(([k, n]) => `${n} ${k}`).join(', ')}. These will be unassigned so another staff member can pick them up.</p>}
          <Field label="Reason *"><textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className="studio-input resize-none" /></Field>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={close} className="rounded-full border border-border px-6 py-3 font-medium">Cancel</button>
            <button type="button" disabled={reason.trim().length < 4} onClick={() => { if (stateOpen) setState(st.id, stateOpen, reason.trim()); toast.success('Access updated'); close(); }} className={`rounded-full px-6 py-3 font-medium disabled:opacity-40 ${stateOpen === 'active' ? 'bg-ink text-ink-foreground' : 'bg-studio-danger text-paper'}`}>Confirm</button>
          </div>
        </div>
      </AdminDialog>
    </AdminPage>
  );
}
