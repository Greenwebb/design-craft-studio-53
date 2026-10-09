import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { AdminPage } from './admin-ui';
import { adminNav, sectionBlurb } from '@/data/admin-data';
import { useAdminOps, type AdminResources } from '@/stores/admin-ops';

const closed = ['completed', 'closed', 'resolved', 'paid', 'refunded', 'published', 'verified', 'active', 'sent', 'installed', 'cancelled', 'rejected', 'archived'];

// Parent overview for a sidebar group: one card per sub-page with live counts.
export function GroupOverview({ group }: { group: string }) {
  const def = adminNav.find((g) => g.group === group);
  const state = useAdminOps();
  if (!def) return null;
  const totals = def.items.map((i) => {
    const rows = (state as unknown as Partial<Record<keyof AdminResources, { state: string }[]>>)[i.id as keyof AdminResources];
    return { item: i, total: rows?.length, open: rows ? rows.filter((r) => !closed.includes(r.state)).length : i.count ?? 0 };
  });
  const openAll = totals.reduce((n, t) => n + t.open, 0);
  return (
    <AdminPage title={group}>
      <section className="relative overflow-hidden rounded-[1.5rem] bg-ink p-6 text-ink-foreground sm:p-8">
        <div aria-hidden className="studio-pattern pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-[0.07]" />
        <p className="relative max-w-xl text-lg text-ink-foreground/75">{def.summary}</p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <div className="rounded-2xl border border-ink-foreground/15 px-5 py-4"><p className="text-3xl font-semibold tabular-nums">{openAll}</p><p className="text-[13px] text-ink-foreground/60">Open items</p></div>
          <div className="rounded-2xl border border-ink-foreground/15 px-5 py-4"><p className="text-3xl font-semibold tabular-nums">{def.items.length}</p><p className="text-[13px] text-ink-foreground/60">Queues</p></div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {totals.map(({ item, total, open }) => (
          <Link key={item.id} to={item.to} className="studio-panel studio-hover group flex flex-col bg-background p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">{item.label}</h2>
              <ArrowUpRight size={18} className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1 flex-1 text-[15px] text-muted-foreground">{sectionBlurb[item.id]}</p>
            <div className="mt-5 flex items-end gap-4">
              <div><p className={`text-3xl font-semibold tabular-nums ${open ? 'text-studio-copper' : ''}`}>{open}</p><p className="text-sm text-muted-foreground">need action</p></div>
              {total !== undefined && <div><p className="text-3xl font-semibold tabular-nums">{total}</p><p className="text-sm text-muted-foreground">total</p></div>}
            </div>
          </Link>
        ))}
      </section>
    </AdminPage>
  );
}
