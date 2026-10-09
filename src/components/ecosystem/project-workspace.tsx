import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Check, FileText, RotateCcw } from 'lucide-react';
import { sharedProjects } from '@/data/ecosystem';
import { workspaceTabs, projectMilestones, projectFiles, projectTimeline, type WorkspaceTab } from '@/data/workflows';
import { EmptyState, MessageThread, StatusLabel } from '@/components/ecosystem/primitives';
import { SiteButton } from '@/components/site';

/** Collector-side workspace; shares tabs and fixtures with the creator workspace. */
export function CustomerProjectWorkspace({ id }: { id: string }) {
  const p = sharedProjects.find((x) => x.id === id);
  const [tab, setTab] = useState<WorkspaceTab>('Overview');
  const [approved, setApproved] = useState<'idle' | 'approved' | 'revision'>('idle');
  if (!p) return <EmptyState title="This project isn’t available." />;
  return (
    <section>
      <p className="note text-studio-green">a shared creative journey</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{p.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-base text-muted-foreground">With {p.creatorName}<StatusLabel>{p.status}</StatusLabel></div>
      <div role="tablist" aria-label="Project sections" className="mt-8 flex gap-2 overflow-x-auto border-b border-border pb-3">
        {workspaceTabs.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 rounded-full px-5 py-2.5 text-base font-medium ${tab === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}>{t}</button>)}
      </div>
      <div className="mt-8">
        {tab === 'Overview' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <img src={p.image} alt="Current concept" className="max-h-[460px] w-full rounded-2xl object-cover" />
            <div className="rounded-2xl border border-border p-6">
              <p className="eyebrow text-muted-foreground">Needs your approval</p>
              <h2 className="mt-3 text-2xl font-medium">{p.nextMilestone}</h2>
              {approved === 'idle' ? (
                <div className="mt-6 flex flex-col gap-3">
                  <SiteButton onClick={() => setApproved('approved')}><Check size={18} />Approve milestone</SiteButton>
                  <SiteButton variant="outline" onClick={() => setApproved('revision')}><RotateCcw size={18} />Ask for a revision</SiteButton>
                </div>
              ) : <p className="mt-6 rounded-2xl bg-studio-green/8 p-4 text-base text-studio-green">{approved === 'approved' ? 'Approved — K6,000 will be released to the artist (preview).' : 'Revision requested — the artist has been notified (preview).'}</p>}
              <Link to="/artists/$slug" params={{ slug: p.artistSlug }} className="mt-6 inline-flex items-center gap-2 text-base">View artist<ArrowUpRight size={18} /></Link>
            </div>
          </div>
        )}
        {tab === 'Messages' && <MessageThread projectId={p.id} />}
        {tab === 'Files' && <ul className="divide-y divide-border rounded-2xl border border-border">{projectFiles.map((f) => <li key={f.name} className="flex items-center gap-4 p-5 text-base"><FileText size={22} className="text-studio-green" /><span className="flex-1 font-medium">{f.name}</span><span className="text-muted-foreground">{f.by} · {f.size}</span></li>)}</ul>}
        {(tab === 'Milestones' || tab === 'Payments') && (
          <ul className="divide-y divide-border rounded-2xl border border-border">
            {projectMilestones.map((m) => <li key={m.title} className="grid gap-2 p-5 text-base sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"><span className="font-medium">{m.title}</span><span>{m.amount} <span className="text-muted-foreground">· {m.share}</span></span><StatusLabel>{m.state}</StatusLabel></li>)}
            {tab === 'Payments' && <li className="p-5 text-base text-muted-foreground">Paid K4,500 of K15,000 · funds are held until you approve each milestone.</li>}
          </ul>
        )}
        {tab === 'Timeline' && <ol className="space-y-5 border-l-2 border-border pl-6">{projectTimeline.map((e) => <li key={e.what} className="text-base"><span className="mr-3 font-medium">{e.when}</span>{e.what}</li>)}<li className="text-base text-muted-foreground">Next: final delivery & completion review</li></ol>}
      </div>
    </section>
  );
}
