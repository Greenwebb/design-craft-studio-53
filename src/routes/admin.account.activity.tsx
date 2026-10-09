import { createFileRoute, Link } from '@tanstack/react-router';
import { useMe } from '@/components/admin/admin-account';
import { SectionCard } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';

export const Route = createFileRoute('/admin/account/activity')({ component: Activity });

function Activity() {
  const me = useMe();
  const mine = useAdminOps((s) => s.audit).filter((a) => a.actor === me.name);
  return (
    <SectionCard title="Actions you performed" aside={<Link to="/admin/audit" className="text-sm font-medium text-studio-green">Full audit log</Link>}>
      {mine.length === 0 ? <p className="text-[15px] text-muted-foreground">Nothing yet. Actions you take on records appear here.</p> : (
        <ol className="relative space-y-5 before:absolute before:inset-y-1 before:left-[5px] before:w-px before:bg-border">
          {mine.map((a) => (
            <li key={a.id} className="relative pl-7">
              <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full bg-studio-green ring-4 ring-background" />
              <p className="font-medium">{a.action}</p>
              <p className="text-sm capitalize text-muted-foreground">{a.resource} · {a.resourceId} · {a.at}</p>
              {a.reason && <p className="text-sm text-muted-foreground">Reason: {a.reason}</p>}
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
