import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { adminSections, payoutStages, fulfilmentStages, payoutExceptions } from '@/data/workflows';
import { StageTracker } from '@/components/ecosystem/workflow';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/')({ head: () => pageHead('Operations overview', 'Disputes, refunds, payouts, moderation and support in one place.', true), component: AdminHome });

function AdminHome() {
  return (
    <div className="space-y-12">
      <div><p className="eyebrow text-muted-foreground">Operations</p><h1 className="mt-3 text-4xl font-semibold">What needs attention today</h1></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {adminSections.map((s) => <Link key={s.id} to="/admin/$section" params={{ section: s.id }} className="studio-panel studio-hover p-6"><p className="text-base text-muted-foreground">{s.label}</p><p className="mt-3 text-4xl font-semibold">{s.count}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-studio-green">Open queue<ArrowUpRight size={16} /></span></Link>)}
      </div>
      <section><h2 className="mb-5 text-2xl font-semibold">Order fulfilment states</h2><StageTracker stages={fulfilmentStages} current={2} label="Fulfilment states" /></section>
      <section>
        <h2 className="mb-5 text-2xl font-semibold">Payout states</h2>
        <StageTracker stages={payoutStages} current={3} label="Payout states" />
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">{payoutExceptions.map((e) => <li key={e.label} className="studio-panel p-5"><p className="text-base font-medium">{e.label}</p><p className="mt-2 text-sm text-muted-foreground">{e.detail}</p></li>)}</ul>
      </section>
    </div>
  );
}
