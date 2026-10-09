import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FloatingNav, floatingNavItem } from '@/components/ecosystem/floating-nav';
import { LayoutGrid, Scale, Undo2, LifeBuoy, MoreHorizontal } from 'lucide-react';
import { adminNav } from '@/data/admin-data';
import { Logo } from '@/components/site';
import { currentStaff } from '@/data/admin-data';
import { useAdminSearch } from '@/components/admin/admin-ui';
import { AdminSearch } from '@/components/admin/admin-search';
import { AdminDialog } from '@/components/admin/admin-ui';

export const Route = createFileRoute('/admin')({ component: AdminShell });

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
        <nav aria-label="Operations" className="mt-8 hidden flex-col lg:flex">
          {adminNav.map((group) => (
            <div key={group.group ?? 'root'} className="mb-5">
              {group.group && <p className="mb-2 px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group.group}</p>}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <Link key={item.id} to={item.to} activeOptions={...(item.to === '/admin' ? [{ exact: true }] : [])[0] ? { exact: true } : {}}
                    activeProps={{ className: 'bg-ink text-ink-foreground' }}
                    className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-medium">
                    <span className="flex-1">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && <span className="rounded-full bg-studio-copper/15 px-2.5 text-[13px] text-studio-copper">{item.count}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
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
          <Link to="/admin/settings" onClick={() => setMore(false)} className="block rounded-full border border-border px-4 py-2.5 text-center text-[15px] font-medium hover:bg-secondary">Settings</Link>
        </div>
      </AdminDialog>
      <AdminSearch />
    </div>
  );
}
