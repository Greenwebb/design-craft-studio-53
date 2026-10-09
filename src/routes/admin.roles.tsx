import { createFileRoute } from '@tanstack/react-router';
import { Check, Copy, Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Field } from '@/components/admin/admin-account';
import { AdminDialog, AdminPage } from '@/components/admin/admin-ui';
import { permissionDomains, useAdminTeam, type Role } from '@/stores/admin-team';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/roles')({ head: () => pageHead('Roles', 'Roles and the permissions beneath them.', true), component: Roles });

function Roles() {
  const { roles, staff, saveRole, archiveRole } = useAdminTeam();
  const [selected, setSelected] = useState(roles[0]!.id);
  const [edit, setEdit] = useState<Role | null>(null);
  const role = roles.find((r) => r.id === selected) ?? roles[0]!;
  const members = (id: string) => staff.filter((s) => s.roleId === id && s.state !== 'deactivated').length;
  const togglePerm = (p: string) => edit && setEdit({ ...edit, permissions: edit.permissions.includes(p) ? edit.permissions.filter((x) => x !== p) : [...edit.permissions, p] });
  return (
    <AdminPage title="Roles">
      <p className="max-w-2xl text-[15px] text-muted-foreground">Roles are bundles of permissions. Access is decided by the permissions underneath, not the role name.</p>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <ul className="space-y-2">
          {roles.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setSelected(r.id)} className={`w-full rounded-2xl border p-4 text-left ${r.id === role.id ? 'border-ink bg-background' : 'border-border hover:bg-secondary'} ${r.archived ? 'opacity-50' : ''}`}>
                <p className="font-medium">{r.label}{r.archived && ' · archived'}</p>
                <p className="text-sm text-muted-foreground">{members(r.id)} staff · {r.permissions.length} permissions{!r.system && ' · custom'}</p>
              </button>
            </li>
          ))}
        </ul>
        <section className="studio-panel min-w-0 bg-background p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-2xl font-semibold">{role.label}</h2><p className="mt-1 text-[15px] text-muted-foreground">{role.description}</p></div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setEdit({ ...role, id: `custom-${Date.now()}`, label: `${role.label} (copy)`, system: false })} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"><Copy size={15} />Duplicate</button>
              {!role.system && <button type="button" onClick={() => setEdit(role)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"><Pencil size={15} />Edit</button>}
              {!role.system && !role.archived && <button type="button" onClick={() => toast[archiveRole(role.id) ? 'success' : 'error'](members(role.id) ? `Move the ${members(role.id)} staff on this role first` : 'Role archived')} className="rounded-full border border-studio-danger/40 px-4 py-2 text-sm font-medium text-studio-danger">Archive</button>}
            </div>
          </div>
          {role.system && <p className="mt-3 text-sm text-muted-foreground">Built-in role — duplicate it to customise.</p>}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-[15px]">
              <tbody>
                {permissionDomains.map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">{d.label}</th>
                    <td className="py-3"><div className="flex flex-wrap gap-2">{d.perms.map((p) => { const on = role.permissions.includes(`${d.id}.${p}`); return <span key={p} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] ${on ? 'bg-studio-green/10 text-studio-green' : 'bg-secondary text-muted-foreground line-through'}`}>{on && <Check size={13} />}{p}</span>; })}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <AdminDialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)} title={edit && roles.some((r) => r.id === edit.id) ? 'Edit role' : 'New custom role'} wide>
        {edit && (
          <div className="space-y-4">
            <Field label="Name"><input value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} className="studio-input" /></Field>
            <Field label="Description"><input value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className="studio-input" /></Field>
            <div className="space-y-3">
              {permissionDomains.map((d) => (
                <div key={d.id} className="flex flex-wrap items-center gap-2"><span className="w-28 text-sm font-medium">{d.label}</span>
                  {d.perms.map((p) => { const k = `${d.id}.${p}`; const on = edit.permissions.includes(k); return <button key={k} type="button" aria-pressed={on} onClick={() => togglePerm(k)} className={`rounded-full border px-3 py-1 text-[13px] ${on ? 'border-studio-green bg-studio-green/10 text-studio-green' : 'border-border'}`}>{p}</button>; })}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setEdit(null)} className="rounded-full border border-border px-6 py-3 font-medium">Cancel</button>
              <button type="button" disabled={edit.label.trim().length < 3} onClick={() => { saveRole(edit); setSelected(edit.id); setEdit(null); toast.success('Role saved'); }} className="rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Save role</button>
            </div>
          </div>
        )}
      </AdminDialog>
    </AdminPage>
  );
}
