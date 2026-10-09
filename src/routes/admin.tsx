import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FloatingNav, floatingNavItem } from '@/components/ecosystem/floating-nav';
import { LayoutGrid, Scale, Undo2, LifeBuoy, MoreHorizontal, Home, Users, Palette, Store, Workflow, Wallet, Shield, Settings, ChevronRight, type LucideIcon } from 'lucide-react';
import { adminNav } from '@/data/admin-data';
import { Logo } from '@/components/site';
import { currentStaff } from '@/data/admin-data';
import { useAdminSearch } from '@/components/admin/admin-ui';
import { AdminSearch } from '@/components/admin/admin-search';
import { AdminDialog } from '@/components/admin/admin-ui';

export const Route = createFileRoute('/admin')({
  component: AdminShell,
  pendingComponent: AdminLoading,
  errorComponent: ({ error, reset }) => (
    <div role="alert" className="mx-auto max-w-lg p-10 text-center">
      <p className="text-xl font-medium">This page couldn't load.</p>
      <p className="mt-2 text-[15px] text-muted-foreground">{error instanceof Error && error.message ? error.message : 'Something went wrong.'} Nothing was changed.</p>
      <button type="button" onClick={reset} className="mt-5 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground">Try again</button>
    </div>
  ),
});

function AdminLoading() {
  return (
    <div className="space-y-4 p-6 lg:p-10" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-56 animate-pulse rounded-full bg-secondary" />
      {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary" />)}
    </div>
  );
}

const mobileIcons = { disputes: Scale, payouts: Undo2, support: LifeBuoy } as const;

// Fourth shell: internal operations. Separate from the public site, creator and
// collector dashboards. Real access will require a server-checked staff role.
function AdminShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const openSearch = useAdminSearch((s) => s.setOpen);
  const [more, setMore] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSearch]);

  const label = (to: string) => adminNav.flatMap((g) => g.items).find((i) => i.to === to)?.label;

  return (
    <div className="studio min-h-screen bg-studio lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="border-b border-border bg-studio-surface p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-ink-foreground">Operations</span>
        </div>
        <SidebarNav path={path} />
        <div className="mt-2 hidden items-center gap-3 rounded-2xl border border-border p-4 lg:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-studio-green/10 text-sm font-semibold text-studio-green">{currentStaff.initials}</span>
          <div className="min-w-0"><p className="truncate text-[15px] font-medium">{currentStaff.name}</p><p className="text-sm text-muted-foreground">{currentStaff.role}</p></div>
        </div>
        <p className="mt-4 hidden text-sm leading-relaxed text-muted-foreground lg:block">Preview only. Real access will require a staff role checked by the server.</p>
      </aside>
      <div className="min-w-0">
        <main className="pb-32 lg:pb-10"><Outlet /></main>
      </div>
      <FloatingNav label="Mobile operations navigation" className="lg:hidden">
        <Link to="/admin" activeOptions={{ exact: true }} className={floatingNavItem(path === '/admin')}><LayoutGrid size={20} />Overview</Link>
        <Link to="/admin/disputes" className={floatingNavItem(path.startsWith('/admin/disputes'))}><Scale size={20} /><span className="max-w-full truncate px-1">Disputes</span></Link>
        <Link to="/admin/payouts" className={floatingNavItem(path.startsWith('/admin/payouts'))}><Undo2 size={20} /><span className="max-w-full truncate px-1">Payouts</span></Link>
        <Link to="/admin/support" className={floatingNavItem(path.startsWith('/admin/support'))}><LifeBuoy size={20} /><span className="max-w-full truncate px-1">Support</span></Link>
        <button type="button" onClick={() => setMore(true)} aria-label="All operations sections"
          className={floatingNavItem(!!label(path) && !['Overview', 'Disputes', 'Payouts', 'Support'].includes(label(path) ?? ''))}>
          <MoreHorizontal size={20} /><span className="max-w-full truncate px-1">More</span>
        </button>
      </FloatingNav>
      <AdminDialog open={more} onOpenChange={setMore} title="All operations sections" description="Jump straight to any queue.">
        <div className="space-y-5">
          {adminNav.filter((g) => g.group).map((group) => (
            <div key={group.group}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group.group}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <Link key={item.id} to={item.to} onClick={() => setMore(false)}
                    className="flex items-center justify-between gap-2 rounded-full border border-border px-4 py-2.5 text-[15px] font-medium hover:bg-secondary">
                    {item.label}{item.count !== undefined && item.count > 0 && <span className="rounded-full bg-studio-copper/15 px-2 text-[13px] text-studio-copper">{item.count}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminDialog>
      <AdminSearch />
    </div>
  );
}

const topIcons: Record<string, LucideIcon> = { overview: Home, users: Users, creators: Palette };
const groupIcons: Record<string, LucideIcon> = { Marketplace: Store, Operations: Workflow, Finance: Wallet, 'Trust & Safety': Shield, System: Settings };
const isActive = (path: string, to: string) => (to === '/admin' ? path === '/admin' : path === to || path.startsWith(to + '/'));

function CountBadge({ n }: { n?: number }) {
  return n !== undefined && n > 0 ? <span className="rounded-full bg-studio-copper/15 px-2.5 text-[13px] text-studio-copper">{n}</span> : null;
}

// Main areas first; sub-pages appear only when a group is expanded.
// The group containing the current page opens automatically.
function SidebarNav({ path }: { path: string }) {
  const activeGroup = adminNav.find((g) => g.group && g.items.some((i) => isActive(path, i.to)))?.group ?? null;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => { if (activeGroup) setOpen((o) => ({ ...o, [activeGroup]: true })); }, [activeGroup]);
  const row = 'flex min-h-[42px] w-full items-center gap-3 rounded-full px-4 text-[15px] font-medium';
  return (
    <nav aria-label="Operations" className="mt-8 hidden flex-col gap-1 lg:flex">
      {adminNav.map((group) => {
        if (!group.group) return group.items.map((item) => {
          const Icon = topIcons[item.id] ?? Home;
          return (
            <Link key={item.id} to={item.to} activeOptions={item.to === '/admin' ? { exact: true } : {}}
              activeProps={{ className: 'bg-ink text-ink-foreground' }} className={`${row} hover:bg-secondary`}>
              <Icon size={19} aria-hidden /><span className="flex-1">{item.label}</span><CountBadge n={item.count} />
            </Link>
          );
        });
        const name = group.group;
        const Icon = groupIcons[name] ?? Settings;
        const expanded = !!open[name];
        const hasActive = activeGroup === name;
        const total = group.items.reduce((n, i) => n + (i.count ?? 0), 0);
        const id = `nav-${name.replace(/\W+/g, '-').toLowerCase()}`;
        return (
          <div key={name} className="mt-1">
            <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setOpen((o) => ({ ...o, [name]: !expanded }))}
              className={`${row} text-left hover:bg-secondary ${hasActive ? 'bg-foreground/[0.04]' : ''}`}>
              <Icon size={19} aria-hidden /><span className="flex-1">{name}</span>
              {!expanded && <CountBadge n={total} />}
              <ChevronRight size={16} aria-hidden className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
            </button>
            {expanded && (
              <div id={id} className="mt-0.5 flex flex-col">
                {group.items.map((item) => {
                  const on = isActive(path, item.to);
                  return (
                    <Link key={item.id} to={item.to} aria-current={on ? 'page' : undefined}
                      className={`relative flex min-h-[34px] items-center gap-2 rounded-full pl-12 pr-4 text-[14px] hover:bg-secondary ${on ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                      {on && <span aria-hidden className="absolute left-[30px] h-1.5 w-1.5 rounded-full bg-foreground" />}
                      <span className="flex-1">{item.label}</span><CountBadge n={item.count} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
