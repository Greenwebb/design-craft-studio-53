import { createFileRoute } from '@tanstack/react-router';
import { Lock, Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, Field, useMe } from '@/components/admin/admin-account';
import { AdminDialog, Fact, FactGrid, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { roleOf, useAdminTeam } from '@/stores/admin-team';

export const Route = createFileRoute('/admin/account/')({ component: MyAccount });

function MyAccount() {
  const me = useMe();
  const role = useAdminTeam((s) => roleOf(s.roles, me.roleId));
  const updateMe = useAdminTeam((s) => s.updateMe);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: me.name, displayName: me.displayName, phone: me.phone, title: me.title });
  const save = () => { updateMe(f); setOpen(false); toast.success('Profile updated'); };
  return (
    <>
      <section className="studio-panel flex flex-col gap-5 bg-background p-6 sm:flex-row sm:items-center">
        <Avatar name={me.name} size={72} />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{me.name}</h2>
          <p className="text-[15px] text-muted-foreground">{me.title || 'No job title'} · {me.department}</p>
          <div className="mt-2 flex flex-wrap gap-2"><StatusPill state={me.state} /><span className="rounded-full bg-ink px-3 py-1 text-[13px] font-medium text-ink-foreground">{role?.label}</span></div>
        </div>
        <button type="button" onClick={() => { setF({ name: me.name, displayName: me.displayName, phone: me.phone, title: me.title }); setOpen(true); }} className="inline-flex items-center gap-2 self-start rounded-full border border-border px-5 py-2.5 font-medium hover:bg-secondary"><Pencil size={17} />Edit profile</button>
      </section>
      <SectionCard title="Details">
        <FactGrid>
          <Fact label="Full name">{me.name}</Fact><Fact label="Display name">{me.displayName}</Fact>
          <Fact label="Work email">{me.email}</Fact><Fact label="Phone">{me.phone || 'Not added'}</Fact>
          <Fact label="Department">{me.department}</Fact><Fact label="Date joined">{me.joined}</Fact>
          <Fact label="Last login">{me.lastLogin}</Fact><Fact label="Invited by">{me.invitedBy}</Fact>
        </FactGrid>
      </SectionCard>
      <SectionCard title="Role & permissions">
        <p className="flex items-start gap-2 text-[15px] text-muted-foreground"><Lock size={17} className="mt-0.5 shrink-0" />You can't change your own role. Ask a Super Admin through Team if you need different access.</p>
        <p className="mt-4 font-medium">{role?.label} · {role?.permissions.length} permissions</p>
        <div className="mt-3 flex flex-wrap gap-2">{role?.permissions.map((p) => <span key={p} className="rounded-full bg-secondary px-3 py-1 text-[13px]">{p}</span>)}</div>
      </SectionCard>
      <AdminDialog open={open} onOpenChange={setOpen} title="Edit profile" description="Email, role and department are managed by an administrator.">
        <div className="space-y-4">
          <Field label="Full name"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="studio-input" /></Field>
          <Field label="Display name"><input value={f.displayName} onChange={(e) => setF({ ...f, displayName: e.target.value })} className="studio-input" /></Field>
          <Field label="Phone"><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="studio-input" placeholder="+260…" /></Field>
          <Field label="Job title"><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="studio-input" /></Field>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary">Cancel</button>
            <button type="button" disabled={f.name.trim().length < 2} onClick={save} className="rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Save</button>
          </div>
        </div>
      </AdminDialog>
    </>
  );
}
