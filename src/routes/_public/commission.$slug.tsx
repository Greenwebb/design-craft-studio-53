import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, MessageSquare, RotateCcw, Wallet, FolderOpen, Paperclip, X, Save, Ban, AlertCircle, History, Palette } from 'lucide-react';
import { getArtist } from '@/data/artists';
import { commissionStages } from '@/data/workflows';
import { questionsFor } from '@/data/commission-questions';
import { useCommission, proposalTotal, kwacha } from '@/stores/commission';
import { StageTracker } from '@/components/ecosystem/workflow';
import { SiteButton } from '@/components/site';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_public/commission/$slug')({
  loader: ({ params }) => { const artist = getArtist(params.slug); if (!artist) throw notFound(); return { artist }; },
  head: ({ loaderData }) => {
    const name = loaderData?.artist.name ?? 'an artist';
    const title = `Commission ${name} — I Am An Artist`;
    const description = `Send a brief, agree a proposal and start a project with ${name}.`;
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: CommissionPage,
});

const input = 'w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base outline-none focus:border-foreground';
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-base font-medium">{label}</span>{children}</label>;
}
function ErrorNote({ text, onClose }: { text: string; onClose: () => void }) {
  return <div role="alert" className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-base"><AlertCircle size={20} className="mt-0.5 shrink-0 text-destructive" /><p className="flex-1">{text}</p><button type="button" aria-label="Dismiss" onClick={onClose}><X size={18} /></button></div>;
}

function CommissionPage() {
  const { artist } = Route.useLoaderData();
  const first = artist.name.split(' ')[0];
  const c = useCommission();
  const [hydrated, setHydrated] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [note, setNote] = useState('');
  const [reply, setReply] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    Promise.resolve(useCommission.persist.rehydrate()).then(() => { useCommission.getState().start(artist.slug, artist.name); setHydrated(true); });
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, [artist.slug, artist.name]);

  if (!artist.capabilities.acceptsCommissions) return (
    <main className="container-x pb-24 pt-32"><h1 className="display-lg">{first} isn’t taking commissions right now.</h1><p className="mt-4 text-base text-muted-foreground">You can still explore and buy their available work.</p><div className="mt-8"><SiteButton href={`/artists/${artist.slug}`}>Back to {artist.name}</SiteButton></div></main>
  );
  if (!hydrated) return <main className="container-x pb-24 pt-32"><p className="text-base text-muted-foreground">Loading your request…</p></main>;

  const questions = questionsFor(artist.disciplines);
  const latest = c.proposals.at(-1);
  const closed = c.status === 'cancelled' || c.status === 'declined';
  const returnTo = `/commission/${artist.slug}`;

  return (
    <main className="container-x pb-24 pt-32">
      <Link to="/artists/$slug" params={{ slug: artist.slug }} className="inline-flex items-center gap-2 text-base text-muted-foreground"><ArrowLeft size={18} />Back to {artist.name}</Link>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="note">let's make something together</p><h1 className="display-lg mt-3">Commission {first}.</h1></div>
        <div className="max-w-sm space-y-3 text-base text-muted-foreground"><p>Preview journey — no message is sent and no payment is taken.</p>{c.stage > 0 && !closed && <a href="/creator/commissions/current" className="inline-flex items-center gap-2 font-medium text-foreground underline underline-offset-4"><Palette size={18} />See this request as the artist</a>}</div>
      </div>

      <div className="mt-12"><StageTracker stages={commissionStages} current={c.stage} label="Commission progress" /></div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-3xl border border-border p-6 sm:p-10">
          {c.error && <div className="mb-6"><ErrorNote text={c.error} onClose={c.clearError} /></div>}

          {closed && (
            <div className="space-y-5">
              <h2 className="flex items-center gap-3 text-2xl font-semibold"><Ban size={24} />{c.status === 'declined' ? `${first} declined this request` : 'You cancelled this request'}</h2>
              <p className="text-base text-muted-foreground">Reason: {c.cancelReason}. {c.stage >= 5 ? 'Your deposit would be refunded in full.' : 'No money was taken.'}</p>
              <SiteButton onClick={c.reset}>Start a new request</SiteButton>
            </div>
          )}

          {!closed && c.stage === 0 && (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); c.submitRequest(); }}>
              <h2 className="text-2xl font-semibold">Tell {first} about your idea</h2>
              <Field label="Project title"><input className={input} value={c.brief.title} onChange={(e) => c.setBrief({ title: e.target.value })} placeholder="e.g. Hotel lobby mural" /></Field>
              <Field label="What do you have in mind?"><textarea rows={4} className={input} value={c.brief.description} onChange={(e) => c.setBrief({ description: e.target.value })} /></Field>
              <div className="grid gap-6 sm:grid-cols-3">
                <Field label="Size or format"><input className={input} value={c.brief.size} onChange={(e) => c.setBrief({ size: e.target.value })} placeholder="3m × 2m" /></Field>
                <Field label="Budget"><input className={input} value={c.brief.budget} onChange={(e) => c.setBrief({ budget: e.target.value })} placeholder="K15,000" /></Field>
                <Field label="Deadline"><input type="date" className={input} value={c.brief.deadline} onChange={(e) => c.setBrief({ deadline: e.target.value })} /></Field>
              </div>
              <fieldset className="space-y-5 rounded-2xl bg-secondary p-5">
                <legend className="px-1 text-base font-semibold">Questions {first} usually asks</legend>
                {questions.map((q) => <Field key={q} label={q}><input className={input} value={c.answers[q] ?? ''} onChange={(e) => c.setAnswer(q, e.target.value)} /></Field>)}
              </fieldset>
              <div>
                <span className="mb-2 block text-base font-medium">Reference images or files</span>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-base text-muted-foreground hover:border-foreground">
                  <Paperclip size={20} />Add photos of the space, moodboards or examples (up to 8)
                  <input type="file" multiple className="sr-only" onChange={(e) => c.addReferences(Array.from(e.target.files ?? []).map((f) => f.name))} />
                </label>
                {c.references.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{c.references.map((r) => <li key={r} className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">{r}<button type="button" aria-label={`Remove ${r}`} onClick={() => c.removeReference(r)}><X size={16} /></button></li>)}</ul>}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <SiteButton type="submit">Send request<ArrowRight size={18} /></SiteButton>
                {signedIn ? <SiteButton variant="outline" onClick={c.saveDraft}><Save size={18} />Save draft</SiteButton>
                  : <SiteButton variant="outline" href={`/login?returnTo=${encodeURIComponent(returnTo)}`} onClick={c.saveDraft}><Save size={18} />Sign in to save draft</SiteButton>}
                {c.draftSavedAt && <span className="text-sm text-muted-foreground">Draft saved {c.draftSavedAt}</span>}
              </div>
            </form>
          )}

          {!closed && c.stage === 1 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-2xl font-semibold"><MessageSquare size={24} />Conversation with {first}</h2>
              <ul className="space-y-3">{c.thread.map((m) => <li key={m.id} className={`max-w-[85%] rounded-2xl p-4 text-base ${m.from === 'customer' ? 'ml-auto bg-ink text-ink-foreground' : 'bg-secondary'}`}>{m.body}<span className="mt-1 block text-xs opacity-70">{m.at}</span></li>)}</ul>
              <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); if (reply.trim()) { c.customerReply(reply.trim()); setReply(''); } }}>
                <input className={input} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply" /><SiteButton type="submit">Send</SiteButton>
              </form>
              <p className="text-base text-muted-foreground">Waiting for {first}’s proposal. <a href="/creator/commissions/current" className="underline underline-offset-4">Open the artist’s side</a> to send one.</p>
            </div>
          )}

          {!closed && (c.stage === 2 || c.stage === 3) && latest && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-3 text-2xl font-semibold"><FileText size={24} />Proposal v{latest.version}</h2>
                {c.proposals.length > 1 && <button type="button" onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center gap-2 text-base underline underline-offset-4"><History size={18} />{showHistory ? 'Hide' : 'Show'} history</button>}
              </div>
              {c.stage === 3 && c.revisionNote && c.proposals.length === 1 && <p className="rounded-2xl bg-cream p-4 text-base">You asked: “{c.revisionNote}” — waiting for {first} to update the quote.</p>}
              {latest.note && <p className="rounded-2xl bg-secondary p-4 text-base">“{latest.note}”</p>}
              <p className="text-base text-muted-foreground">{c.brief.title || 'Your commission'} · {c.brief.size || 'size to confirm'} · {latest.weeks} weeks</p>
              <ul className="divide-y divide-border rounded-2xl border border-border">
                {latest.lines.map((m) => <li key={m.title} className="flex justify-between gap-4 p-4 text-base"><span>{m.title}</span><span className="font-medium">{kwacha(m.amount)}</span></li>)}
                <li className="flex justify-between p-4 text-lg font-semibold"><span>Total</span><span>{kwacha(proposalTotal(latest))}</span></li>
              </ul>
              {showHistory && <ol className="space-y-2">{c.proposals.slice(0, -1).reverse().map((p) => <li key={p.version} className="flex justify-between rounded-2xl border border-border p-4 text-base text-muted-foreground"><span>v{p.version} · {p.sentAt}</span><span className="line-through">{kwacha(proposalTotal(p))}</span></li>)}</ol>}
              <div className="flex flex-wrap gap-3">
                <SiteButton onClick={c.accept}>Accept proposal<ArrowRight size={18} /></SiteButton>
                <SiteButton variant="outline" onClick={() => { if (note.trim()) { c.requestRevision(note.trim()); setNote(''); } }}><RotateCcw size={18} />Request revision</SiteButton>
              </div>
              <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What would you like changed?" />
            </div>
          )}

          {!closed && c.stage === 3 && !latest && <p className="text-base">Waiting for the revised proposal.</p>}

          {!closed && (c.stage === 4 || c.stage === 5) && latest && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-2xl font-semibold"><Wallet size={24} />Pay the deposit</h2>
              <p className="text-base text-muted-foreground">{kwacha(latest.lines[0]?.amount ?? 0)} is held safely and released to {first} when you approve the first milestone.</p>
              <div className="flex flex-wrap gap-3">
                <SiteButton onClick={() => c.payDeposit()}>Pay {kwacha(latest.lines[0]?.amount ?? 0)} (preview)<ArrowRight size={18} /></SiteButton>
                <SiteButton variant="outline" onClick={() => c.payDeposit(true)}>Try a failed payment</SiteButton>
              </div>
            </div>
          )}

          {!closed && c.stage === 6 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-2xl font-semibold"><FolderOpen size={24} />Your project is ready</h2>
              <p className="text-base text-muted-foreground">Messages, files, milestones and payments now live in one shared workspace.</p>
              <div className="flex flex-wrap gap-3">
                <SiteButton href="/account/projects/hotel-lobby-mural">Open project workspace<ArrowRight size={18} /></SiteButton>
                <SiteButton variant="outline" onClick={c.reset}>Start another</SiteButton>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4 self-start rounded-3xl bg-secondary p-6">
          <h3 className="text-lg font-semibold">Your brief</h3>
          <p className="text-base">{c.brief.title || 'Untitled request'}</p>
          <p className="text-sm text-muted-foreground">{c.references.length} reference file{c.references.length === 1 ? '' : 's'} · {Object.values(c.answers).filter(Boolean).length} answers</p>
          {!closed && c.stage > 0 && c.stage < 6 && (cancelling ? (
            <div className="space-y-3">
              <input className={input} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you cancelling?" />
              <div className="flex gap-2"><SiteButton onClick={() => { c.cancel('customer', reason.trim() || 'No reason given'); setCancelling(false); }}>Confirm cancel</SiteButton><SiteButton variant="outline" onClick={() => setCancelling(false)}>Keep</SiteButton></div>
            </div>
          ) : <button type="button" onClick={() => setCancelling(true)} className="inline-flex items-center gap-2 text-base text-destructive"><Ban size={18} />Cancel request</button>)}
        </aside>
      </div>
    </main>
  );
}
