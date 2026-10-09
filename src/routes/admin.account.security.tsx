import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, Laptop, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Field, useMe } from '@/components/admin/admin-account';
import { SectionCard } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { useAdminTeam } from '@/stores/admin-team';

export const Route = createFileRoute('/admin/account/security')({ component: Security });

// Demo rule so the "wrong password" path can be seen: the current password is "preview".
function Security() {
  const me = useMe();
  const signOutSession = useAdminTeam((s) => s.signOutSession);
  const signOutOthers = useAdminTeam((s) => s.signOutOthers);
  const log = useAdminOps((s) => s.log);
  const events = useAdminOps((s) => s.audit).filter((a) => a.resource === 'team' && a.resourceId === me.id);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '', revoke: true });
  const [error, setError] = useState('');
  const strong = pw.next.length >= 10 && /\d/.test(pw.next) && /[A-Za-z]/.test(pw.next);
  const submit = () => {
    if (pw.current !== 'preview') return setError('Your current password is incorrect.');
    if (!strong) return setError('Use at least 10 characters with letters and numbers.');
    if (pw.next !== pw.confirm) return setError('The new passwords don’t match.');
    setError(''); log('Password changed', 'team', me.id);
    if (pw.revoke) signOutOthers(me.id);
    setPw({ current: '', next: '', confirm: '', revoke: true });
    toast.success(pw.revoke ? 'Password updated · other sessions signed out' : 'Password updated');
  };
  return (
    <>
      <SectionCard title="Email">
        <p className="flex items-center gap-2 text-[15px]"><CheckCircle2 size={18} className="text-studio-success" />{me.email} · verified</p>
        <p className="mt-2 text-sm text-muted-foreground">Two-step verification isn't available yet.</p>
      </SectionCard>
      <SectionCard title="Change password">
        <div className="grid max-w-xl gap-4">
          <Field label="Current password"><input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="studio-input" autoComplete="current-password" /></Field>
          <Field label="New password"><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="studio-input" autoComplete="new-password" /></Field>
          {pw.next && <p className={`text-sm ${strong ? 'text-studio-success' : 'text-studio-warning'}`}>{strong ? 'Strong password' : 'Too weak — 10+ characters with letters and numbers'}</p>}
          <Field label="Confirm new password"><input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="studio-input" autoComplete="new-password" /></Field>
          <label className="flex items-center gap-3 text-[15px]"><input type="checkbox" checked={pw.revoke} onChange={(e) => setPw({ ...pw, revoke: e.target.checked })} className="h-5 w-5" />Sign out my other sessions</label>
          {error && <p role="alert" className="rounded-xl border border-studio-danger/30 p-3 text-[15px] text-studio-danger">{error}</p>}
          <button type="button" onClick={submit} disabled={!pw.current || !pw.next || !pw.confirm} className="w-fit rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Update password</button>
          <p className="text-sm text-muted-foreground">Preview: the current password is “preview”.</p>
        </div>
      </SectionCard>
      <SectionCard title="Active sessions" aside={me.sessions.length > 1 ? <button type="button" onClick={() => { signOutOthers(me.id); toast.success('Other sessions signed out'); }} className="rounded-full border border-border px-5 py-2 text-[15px] font-medium hover:bg-secondary">Sign out all other sessions</button> : undefined}>
        <ul className="divide-y divide-border">
          {me.sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-4 py-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary">{/iPhone|Android|iPad/.test(s.device) ? <Smartphone size={20} /> : <Laptop size={20} />}</span>
              <div className="flex-1"><p className="font-medium">{s.device}</p><p className="text-sm text-muted-foreground">{s.place} · {s.lastActive}</p></div>
              {s.current ? <span className="rounded-full bg-studio-green/10 px-3 py-1 text-[13px] font-medium text-studio-green">This device</span>
                : <button type="button" onClick={() => signOutSession(me.id, s.id)} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">Sign out</button>}
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard title="Recent security activity">
        {events.length ? <ul className="space-y-3">{events.map((e) => <li key={e.id} className="text-[15px]"><span className="font-medium">{e.action}</span> <span className="text-muted-foreground">· {e.at}</span></li>)}</ul>
          : <p className="text-[15px] text-muted-foreground">No security changes this session. Signed in {me.lastLogin} from Lusaka.</p>}
      </SectionCard>
    </>
  );
}
