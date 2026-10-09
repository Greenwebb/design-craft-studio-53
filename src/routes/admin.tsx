import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { FloatingNav, floatingNavItem } from '@/components/ecosystem/floating-nav';
import { LayoutGrid, Scale, Undo2, Banknote, ShieldCheck, LifeBuoy } from 'lucide-react';
import { adminSections } from '@/data/workflows';
import { Logo } from '@/components/site';
import { DashboardTopBar } from '@/components/ecosystem/top-bar';
import { AccountMenu } from '@/components/ecosystem/account-menu';

export const Route = createFileRoute('/admin')({ component: AdminShell });

const icons = { disputes: Scale, refunds: Undo2, payouts: Banknote, moderation: ShieldCheck, support: LifeBuoy } as const;

// Internal operations shell: separate from public, creator and collector shells.
function AdminShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="studio min-h-screen bg-studio lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-studio-surface p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3"><Logo /><span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-ink-foreground">Operations</span></div>
        <nav aria-label="Operations" className="mt-8 hidden flex-col gap-2 lg:flex">
          <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: 'bg-ink text-ink-foreground' }} className="flex shrink-0 items-center gap-3 rounded-full px-4 py-3 text-base font-medium"><LayoutGrid size={20} />Overview</Link>
          {adminSections.map((s) => { const Icon = icons[s.id]; return (
            <Link key={s.id} to="/admin/$section" params={{ section: s.id }} activeProps={{ className: 'bg-ink text-ink-foreground' }} className="flex shrink-0 items-center gap-3 rounded-full px-4 py-3 text-base font-medium"><Icon size={20} /><span className="flex-1">{s.label}</span><span className="rounded-full bg-studio-copper/15 px-2.5 text-sm text-studio-copper">{s.count}</span></Link>
          ); })}
        </nav>
        <p className="mt-8 hidden text-sm text-muted-foreground lg:block">Preview only. Real access will require a staff role checked by the server.</p>
      </aside>
      <div className="min-w-0">
        <DashboardTopBar eyebrow="Operations" title={adminSections.find((s) => path === `/admin/${s.id}`)?.label ?? 'Overview'}><AccountMenu /></DashboardTopBar>
        <main className="px-5 pb-32 pt-7 sm:px-10 sm:pt-9 lg:pb-10"><Outlet /></main>
      </div>
      <FloatingNav label="Mobile operations navigation" className="lg:hidden">
        <Link to="/admin" activeOptions={{ exact: true }} className={floatingNavItem(path === '/admin')}><LayoutGrid size={20} />Overview</Link>
        {adminSections.map((s) => { const Icon = icons[s.id]; return <Link key={s.id} to="/admin/$section" params={{ section: s.id }} className={floatingNavItem(path === `/admin/${s.id}`)}><Icon size={20} /><span className="max-w-full truncate px-1">{s.label}</span></Link>; })}
      </FloatingNav>
    </div>
  );
}
