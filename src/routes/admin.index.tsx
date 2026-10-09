import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, ChevronRight, ShieldCheck, Wallet, Scale, Truck, Flag, LifeBuoy, BadgeCheck, type LucideIcon } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AdminPage } from '@/components/admin/admin-ui';
import { activityFeed, attentionQueue, currentStaff, exceptionQueue, kpiTiles, marketplaceSnapshot, priorityMeta, revenueTrend, type Priority } from '@/data/admin-data';
import { works } from '@/data/works';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/')({ head: () => pageHead('Operations overview', 'What needs attention across the marketplace today.', true), component: AdminOverview });

const barTone: Record<Priority, string> = { critical: 'bg-studio-danger', high: 'bg-studio-warning', normal: 'bg-studio-info', low: 'bg-foreground/20' };
const dotTone = { success: 'bg-studio-success', danger: 'bg-studio-danger', info: 'bg-studio-info', warning: 'bg-studio-warning' } as const;
const queueIcon: Record<string, LucideIcon> = { '/admin/payouts': Wallet, '/admin/payments': ShieldCheck, '/admin/disputes': Scale, '/admin/verification': BadgeCheck, '/admin/orders': Truck, '/admin/moderation': Flag, '/admin/support': LifeBuoy };
const money = (n: number) => `K${n.toLocaleString('en-US')}`;

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" className="h-9 w-20 shrink-0" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={up ? 'stroke-studio-green' : 'stroke-studio-copper'} />
    </svg>
  );
}

function AdminOverview() {
  const critical = attentionQueue.filter((a) => a.priority === 'critical').reduce((n, a) => n + a.count, 0);
  const total = attentionQueue.reduce((n, a) => n + a.count, 0);
  const weekGms = revenueTrend.reduce((n, d) => n + d.gms, 0);
  const review = works.slice(0, 4);

  return (
    <AdminPage title="Overview">
      {/* Briefing band */}
      <section className="relative overflow-hidden rounded-[1.5rem] bg-ink p-6 text-ink-foreground sm:p-8">
        <div aria-hidden className="studio-pattern pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-[0.07]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/60">Friday briefing</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Good morning, {currentStaff.name.split(' ')[0]}.<br /><span className="text-ink-foreground/60">{total} items need a decision — {critical} are critical.</span></h2>
            <div className="mt-6 flex flex-wrap gap-3 [&>a]:justify-center max-sm:[&>a]:flex-1">
              <Link to="/admin/payouts" className="inline-flex items-center gap-2 rounded-full bg-ink-foreground px-5 py-3 text-[15px] font-medium text-ink">Start with critical<ChevronRight size={18} /></Link>
              <Link to="/admin/disputes" className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 px-5 py-3 text-[15px] font-medium">Open disputes</Link>
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-3 gap-3">
            {[{ v: critical, l: 'Critical' }, { v: total, l: 'Open items' }, { v: `K${Math.round(weekGms/1000)}k`, l: 'Sales this week' }].map((s) => (
              <div key={s.l} className="min-w-0 rounded-2xl border border-ink-foreground/15 p-3 sm:p-4">
                <p className="text-2xl font-semibold tabular-nums sm:text-3xl">{s.v}</p>
                <p className="mt-1 text-[13px] text-ink-foreground/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI tiles */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpiTiles.map((k) => (
          <Link key={k.label} to={k.to} className="studio-panel studio-hover group min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between"><p className="text-[15px] text-muted-foreground">{k.label}</p><ArrowUpRight size={18} className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
              <p className="text-2xl sm:text-3xl font-semibold tabular-nums">{k.value}</p><Spark data={k.spark} up={k.up} />
            </div>
            <p className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${k.up ? 'text-studio-green' : 'text-studio-copper'}`}>
              {k.up ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{k.delta}
            </p>
          </Link>
        ))}
      </section>

      {/* Chart + attention */}
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="studio-panel flex min-w-0 flex-col bg-background p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-xl font-semibold">Sales this week</h2><p className="mt-1 text-sm text-muted-foreground">Gross sales and platform fees by day</p></div>
            <div className="flex gap-4 text-sm"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-studio-green" />Sales</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-studio-copper" />Fees</span></div>
          </div>
          <div className="mt-6 h-64 flex-1 xl:min-h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ left: -12, right: 4, top: 4 }}>
                <defs>
                  <linearGradient id="gms" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--studio-green)" stopOpacity={0.25} /><stop offset="100%" stopColor="var(--studio-green)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--studio-border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={13} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v: number) => `K${v / 1000}k`} />
                <Tooltip formatter={(v: number) => money(v)} contentStyle={{ borderRadius: 12, border: '1px solid var(--studio-border)' }} />
                <Area type="monotone" dataKey="gms" name="Sales" stroke="var(--studio-green)" strokeWidth={2.5} fill="url(#gms)" />
                <Area type="monotone" dataKey="fees" name="Fees" stroke="var(--studio-copper)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="studio-panel flex min-w-0 flex-col bg-background p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Needs attention</h2>
          <ul className="mt-4 divide-y divide-border">
            {attentionQueue.map((a) => {
              const Icon = queueIcon[a.to] ?? AlertTriangle;
              return (
                <li key={a.id}>
                  <Link to={a.to} className="group flex items-center gap-3 py-3">
                    <span className={`h-9 w-1 shrink-0 rounded-full ${barTone[a.priority]}`} aria-label={priorityMeta[a.priority].label} />
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary"><Icon size={19} aria-hidden /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-medium">{a.label}</span><span className="block truncate text-sm text-muted-foreground">{a.detail}</span></span>
                    <span className="text-xl font-semibold tabular-nums">{a.count}</span>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Exceptions */}
      <section>
        <div className="flex items-end justify-between gap-3">
          <div><h2 className="text-2xl font-semibold">Blocking money, delivery or trust</h2><p className="mt-1 text-[15px] text-muted-foreground">Resolve these first — each opens its record.</p></div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exceptionQueue.map((e) => (
            <Link key={e.id} to={e.to} className="studio-panel studio-hover relative flex flex-col overflow-hidden bg-background p-5">
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${barTone[e.priority]}`} />
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${priorityMeta[e.priority].className}`}>{priorityMeta[e.priority].label}</span>
                <span className="text-lg font-semibold tabular-nums">{e.amount ? money(e.amount) : '—'}</span>
              </div>
              <p className="mt-4 text-[17px] font-semibold">{e.what}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{e.who}</p>
              <p className="mt-3 flex flex-1 items-start gap-1.5 text-sm"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-studio-copper" aria-hidden />{e.why}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-studio-green">Open record<ArrowUpRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Works + activity */}
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="studio-panel flex min-w-0 flex-col bg-background p-5 sm:p-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Works awaiting review</h2><Link to="/admin/works" className="text-sm font-medium text-studio-green">See all</Link></div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {review.map((w) => (
              <Link key={w.id} to="/admin/works" className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-secondary"><img src={w.image} alt={w.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                <p className="mt-2 truncate font-medium">{w.title}</p><p className="truncate text-sm text-muted-foreground">{w.artist.name}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="studio-panel flex min-w-0 flex-col bg-background p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Team activity</h2>
          <ol className="relative mt-5 space-y-5 before:absolute before:inset-y-1 before:left-[5px] before:w-px before:bg-border">
            {activityFeed.map((a) => (
              <li key={a.id} className="relative pl-7">
                <span className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-background ${dotTone[a.tone]}`} />
                <p className="text-[15px]"><span className="font-medium">{a.who}</span> {a.what}</p>
                <p className="text-sm text-muted-foreground">{a.when}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Snapshot */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-3 xl:grid-cols-5">
        {marketplaceSnapshot.map((m) => (
          <div key={m.label} className="bg-background p-5">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{m.value}</p>
            <p className={`text-sm font-medium ${m.delta.startsWith('−') ? 'text-studio-copper' : 'text-studio-green'}`}>{m.delta} this month</p>
          </div>
        ))}
      </section>
    </AdminPage>
  );
}
