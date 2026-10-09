import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Field } from '@/components/admin/admin-account';
import { AdminPage } from '@/components/admin/admin-ui';
import { roleOf, useAdminTeam } from '@/stores/admin-team';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/invite/$token')({ head: () => pageHead('Accept invitation', 'Join the I Am An Artist operations team.', true), component: AcceptInvite });

function AcceptInvite() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const { invitations, roles, acceptInvite } = useAdminTeam();
  const inv = invitations.find((i) => i.token === token);
  const [pw, setPw] = useState('');
  const [terms, setTerms] = useState(false);
  if (!inv || inv.state !== 'pending') {
    return (
      <AdminPage title="Invitation">
        <div className="studio-panel max-w-lg bg-background p-8">
          <h2 className="text-2xl font-semibold">{inv?.state === 'accepted' ? 'Already accepted' : inv?.state === 'revoked' ? 'Invitation revoked' : 'Invitation expired'}</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">{inv?.state === 'accepted' ? 'This invitation has been used. Sign in instead.' : 'Ask the administrator who invited you to send a new invitation.'}</p>
          <Link to="/admin/team" className="mt-5 inline-flex rounded-full border border-border px-5 py-2.5 font-medium">Back to Team</Link>
        </div>
      </AdminPage>
    );
  }
  const strong = pw.length >= 10 && /\d/.test(pw) && /[A-Za-z]/.test(pw);
  return (
    <AdminPage title="Accept invitation">
      <div className="studio-panel max-w-lg space-y-5 bg-background p-8">
        <div><h2 className="text-2xl font-semibold">Welcome, {inv.name.split(' ')[0]}</h2><p className="mt-1 text-[15px] text-muted-foreground">You've been invited as <b>{roleOf(roles, inv.roleId)?.label}</b> in {inv.department}.</p></div>
        <Field label="Email"><input value={inv.email} readOnly className="studio-input opacity-70" /></Field>
        <Field label="Create a password"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="studio-input" autoComplete="new-password" /></Field>
        {pw && !strong && <p className="text-sm text-studio-warning">10+ characters with letters and numbers.</p>}
        <label className="flex items-start gap-3 text-[15px]"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-5 w-5" />I agree to the staff access policy and confidentiality terms.</label>
        <button type="button" disabled={!strong || !terms} onClick={() => { if (acceptInvite(token)) void navigate({ to: '/admin/team' }); }} className="w-full rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Activate account</button>
        <p className="text-sm text-muted-foreground">Preview: the account is added to Team for this session.</p>
      </div>
    </AdminPage>
  );
}
