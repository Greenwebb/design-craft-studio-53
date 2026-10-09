import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import { AdminPage, SectionCard } from '@/components/admin/admin-ui';
import { attentionQueue, exceptionQueue, marketplaceSnapshot, operationsToday, priorityMeta } from '@/data/admin-data';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/')({ head: () => pageHead('Operations overview', 'What needs attention across the marketplace today.', true), component: AdminOverview });

function AdminOverview() {
  const byPriority = (p: string) => attentionQueue.filter((a) => a.priority === p);
  return (
    <AdminPage title="Overview">
      <section>
        <h2 className="text-2xl font-semibold">Needs attention</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(['critical', 'high', 'normal', 'low'] as const).map((p) => (
            <div key={p} className="space-y-3">
              <p className={`inline-flex rounded-full px-3 py-1 text-[13px] font-semibold ${priorityMeta[p].className}`}>{priorityMeta[p].label}</p>
              {byPriority(p).length === 0 && <p className="text-sm text-muted-foreground">Nothing at this priority.</p>}
              {byPriority(p).map((a) => (
                <Link key={a.id} to={a.to} className="studio-panel studio-hover block p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{a.label}</p><span className="text-3xl font-semibold">{a.count}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.detail}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-studio-green">Open queue<ArrowUpRight size={16} /></span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Operations today</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {operationsToday.map((m) => (
            <div key={m.label} className="studio-panel p-5"><p className="text-3xl font-semibold">{m.value}</p><p className="mt-1 text-sm text-muted-foreground">{m.label}</p></div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Exception queue</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Every item here blocks money, delivery or trust. Each links into its operational queue.</p>
        <ul className="mt-5 space-y-3">
          {exceptionQueue.map((e) => (
            <li key={e.id}>
              <Link to={e.to} className="studio-panel studio-hover grid gap-3 p-5 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                <span className={`w-fit rounded-full px-3 py-1 text-[13px] font-semibold ${priorityMeta[e.priority].className}`}>{priorityMeta[e.priority].label}</span>
                <div className="min-w-0"><p className="font-medium">{e.what}</p><p className="mt-0.5 text-sm text-muted-foreground">{e.who}</p><p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-studio-copper" aria-hidden />{e.why}</p></div>
                <div className="text-right"><p className="text-lg font-semibold">{e.amount ? `K${e.amount.toLocaleString('en-US')}` : '—'}</p><span className="text-sm font-medium text-studio-green">Open</span></div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SectionCard title="Marketplace snapshot">
        <div className="grid gap-6 sm:grid-cols-3 xl:grid-cols-5">
          {marketplaceSnapshot.map((m) => (
            <div key={m.label}><p className="text-sm text-muted-foreground">{m.label}</p><p className="mt-1 text-2xl font-semibold">{m.value}</p><p className="text-sm text-studio-green">{m.delta}</p></div>
          ))}
        </div>
      </SectionCard>
    </AdminPage>
  );
}
