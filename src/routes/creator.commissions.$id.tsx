import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Send, Ban, MessageSquare, Paperclip, History } from 'lucide-react';
import { SiteButton } from '@/components/site';
import { StageTracker } from '@/components/ecosystem/workflow';
import { commissionStages } from '@/data/workflows';
import { useCommission, proposalTotal, kwacha, type ProposalLine } from '@/stores/commission';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/creator/commissions/$id')({ head: () => pageHead('Commission request', 'Reply, ask questions and send a proposal to your collector.', true), component: Page });

const input = 'w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-foreground';

function Page() {
  const c = useCommission();
  const [ready, setReady] = useState(false);
  const [question, setQuestion] = useState('');
  const [lines, setLines] = useState<ProposalLine[]>([{ title: 'Deposit', amount: 4500 }, { title: 'Concept approval', amount: 6000 }, { title: 'Final delivery', amount: 4500 }]);
  const [weeks, setWeeks] = useState(6);
  const [note, setNote] = useState('');
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState('');
  useEffect(() => { Promise.resolve(useCommission.persist.rehydrate()).then(() => setReady(true)); }, []);
  useEffect(() => { const l = useCommission.getState().proposals.at(-1); if (l) { setLines(l.lines); setWeeks(l.weeks); } }, [ready]);
  if (!ready) return <p className="text-base text-muted-foreground">Loading…</p>;
  if (c.status === 'draft' || !c.artistSlug) return <div className="rounded-3xl border border-border p-10"><h1 className="text-2xl font-semibold">No commission requests yet</h1><p className="mt-3 text-base text-muted-foreground">When a collector sends a brief from your profile, it appears here.</p></div>;

  const closed = c.status !== 'active';
  const total = lines.reduce((s, l) => s + (l.amount || 0), 0);
  const valid = lines.length > 0 && lines.every((l) => l.title.trim() && l.amount > 0) && weeks > 0;
  const canPropose = !closed && c.stage >= 1 && c.stage <= 3 && (c.stage !== 2);

  return (
    <div className="space-y-8">
      <header><p className="text-sm uppercase tracking-wide text-muted-foreground">Commission request · {c.artistName}</p><h1 className="mt-2 text-3xl font-semibold">{c.brief.title}</h1><p className="mt-2 text-base text-muted-foreground">{c.brief.size || 'Size open'} · Budget {c.brief.budget || 'not given'} · Due {c.brief.deadline || 'flexible'}</p></header>
      <StageTracker stages={commissionStages} current={c.stage} label="Commission progress" />
      {closed && <p role="status" className="rounded-2xl bg-secondary p-4 text-base">This request was {c.status}: {c.cancelReason}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-5 rounded-3xl border border-border p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><MessageSquare size={22} />Brief & conversation</h2>
          <p className="text-base">{c.brief.description}</p>
          {Object.entries(c.answers).filter(([, a]) => a).map(([q, a]) => <div key={q}><p className="text-sm text-muted-foreground">{q}</p><p className="text-base">{a}</p></div>)}
          {c.references.length > 0 && <ul className="flex flex-wrap gap-2">{c.references.map((r) => <li key={r} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm"><Paperclip size={14} />{r}</li>)}</ul>}
          <ul className="space-y-2">{c.thread.map((m) => <li key={m.id} className={`max-w-[85%] rounded-2xl p-3 text-base ${m.from === 'creator' ? 'ml-auto bg-ink text-ink-foreground' : 'bg-secondary'}`}>{m.body}<span className="mt-1 block text-xs opacity-70">{m.at}</span></li>)}</ul>
          {!closed && c.stage < 4 && <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (question.trim()) { c.creatorAsk(question.trim()); setQuestion(''); } }}><input className={input} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a clarifying question" /><SiteButton type="submit">Ask</SiteButton></form>}
        </section>

        <section className="space-y-5 rounded-3xl border border-border p-6">
          <h2 className="text-xl font-semibold">Proposal builder{c.proposals.length ? ` · v${c.proposals.length + 1}` : ''}</h2>
          {c.stage === 3 && c.revisionNote && <p className="rounded-2xl bg-cream p-4 text-base">Collector asked: “{c.revisionNote}”</p>}
          {c.stage === 2 && <p className="text-base text-muted-foreground">Proposal sent — waiting for the collector to accept or ask for changes.</p>}
          {c.stage >= 4 && <p className="text-base text-muted-foreground">Accepted at {kwacha(proposalTotal(c.proposals.at(-1)))}{c.stage === 6 ? ' · deposit paid, project created.' : ' · awaiting deposit.'}</p>}
          {canPropose && <>
            <ul className="space-y-3">{lines.map((l, i) => <li key={i} className="flex gap-2">
              <input aria-label="Milestone" className={input} value={l.title} onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
              <input aria-label="Amount in kwacha" type="number" min={0} className={`${input} max-w-[140px]`} value={l.amount} onChange={(e) => setLines(lines.map((x, j) => j === i ? { ...x, amount: Number(e.target.value) } : x))} />
              <button type="button" aria-label="Remove milestone" onClick={() => setLines(lines.filter((_, j) => j !== i))} className="px-2 text-muted-foreground"><Trash2 size={18} /></button>
            </li>)}</ul>
            <button type="button" onClick={() => setLines([...lines, { title: '', amount: 0 }])} className="inline-flex items-center gap-2 text-base font-medium"><Plus size={18} />Add milestone</button>
            <label className="block"><span className="mb-2 block text-base font-medium">Timeline (weeks)</span><input type="number" min={1} className={`${input} max-w-[140px]`} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} /></label>
            <textarea rows={2} className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="A note for the collector" />
            <div className="flex items-center justify-between text-lg font-semibold"><span>Total</span><span>{kwacha(total)}</span></div>
            {!valid && <p className="text-sm text-destructive">Each milestone needs a name and an amount, and the timeline must be at least one week.</p>}
            <SiteButton disabled={!valid} onClick={() => { c.sendProposal({ lines, weeks, note }); setNote(''); }}><Send size={18} />Send proposal</SiteButton>
          </>}
          {c.proposals.length > 0 && <div><h3 className="flex items-center gap-2 text-base font-semibold"><History size={18} />History</h3><ol className="mt-2 space-y-2">{[...c.proposals].reverse().map((p) => <li key={p.version} className="flex justify-between rounded-2xl bg-secondary px-4 py-3 text-base"><span>v{p.version} · {p.sentAt}</span><span>{kwacha(proposalTotal(p))}</span></li>)}</ol></div>}
          {!closed && c.stage < 6 && (declining ? <div className="space-y-2"><input className={input} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for declining" /><div className="flex gap-2"><SiteButton onClick={() => c.cancel('creator', reason.trim() || 'Not available')}>Decline request</SiteButton><SiteButton variant="outline" onClick={() => setDeclining(false)}>Keep</SiteButton></div></div>
            : <button type="button" onClick={() => setDeclining(true)} className="inline-flex items-center gap-2 text-base text-destructive"><Ban size={18} />Decline</button>)}
        </section>
      </div>
      <a href={`/commission/${c.artistSlug}`} className="inline-block text-base underline underline-offset-4">View as the collector</a>
    </div>
  );
}
