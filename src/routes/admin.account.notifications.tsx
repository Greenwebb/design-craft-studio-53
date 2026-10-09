import { createFileRoute } from '@tanstack/react-router';
import { Toggle, useMe } from '@/components/admin/admin-account';
import { SectionCard } from '@/components/admin/admin-ui';
import { can, useAdminTeam } from '@/stores/admin-team';

export const Route = createFileRoute('/admin/account/notifications')({ component: Notifs });

function Notifs() {
  const me = useMe();
  const roles = useAdminTeam((s) => s.roles);
  const notifs = useAdminTeam((s) => s.notifs);
  const toggle = useAdminTeam((s) => s.toggleNotif);
  return (
    <SectionCard title="Operational alerts">
      <p className="text-[15px] text-muted-foreground">Alerts follow your permissions — areas your role can't see are switched off.</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_auto] items-center gap-x-6 gap-y-4">
        <span /><span className="text-sm font-medium text-muted-foreground">In-app</span><span className="text-sm font-medium text-muted-foreground">Email</span>
        {notifs.map((n) => {
          const allowed = can(roles, me.roleId, n.needs);
          return [
            <div key={`${n.id}l`}><p className="font-medium">{n.label}</p>{!allowed && <p className="text-sm text-muted-foreground">Needs {n.needs}</p>}</div>,
            <Toggle key={`${n.id}a`} on={allowed && n.inApp} disabled={!allowed} onChange={() => toggle(n.id, 'inApp')} label={`${n.label} in-app`} />,
            <Toggle key={`${n.id}b`} on={allowed && n.email} disabled={!allowed} onChange={() => toggle(n.id, 'email')} label={`${n.label} email`} />,
          ];
        })}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Text message alerts aren't available yet.</p>
    </SectionCard>
  );
}
