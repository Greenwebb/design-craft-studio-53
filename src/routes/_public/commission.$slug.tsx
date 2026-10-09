import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, MessageSquare, RotateCcw, Wallet, FolderOpen } from 'lucide-react';
import { getArtist } from '@/data/artists';
import { commissionStages, projectMilestones } from '@/data/workflows';
import { useCommission } from '@/stores/commission';
import { StageTracker } from '@/components/ecosystem/workflow';
import { SiteButton } from '@/components/site';

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-base font-medium">{label}</span>{children}</label>;
}

function CommissionPage() {
  const { artist } = Route.useLoaderData();
  const first = artist.name.split(' ')[0];
  const { stage, brief, setBrief, goTo, requestRevision, revisionNote, reset } = useCommission();
  const [note, setNote] = useState('');
  const input = 'w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base outline-none focus:border-foreground';

  return (
    <main className="container-x pb-24 pt-32">
      <Link to="/artists/$slug" params={{ slug: artist.slug }} className="inline-flex items-center gap-2 text-base text-muted-foreground"><ArrowLeft size={18} />Back to {artist.name}</Link>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="note">let's make something together</p><h1 className="display-lg mt-3">Commission {first}.</h1></div>
        <p className="max-w-sm text-base text-muted-foreground">Preview journey — no message is sent and no payment is taken.</p>
      </div>

      <div className="mt-12"><StageTracker stages={commissionStages} current={stage} label="Commission progress" /></div>

      <section className="mt-12 max-w-3xl rounded-3xl border border-border p-6 sm:p-10">
        {stage === 0 && (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); goTo(1); }}>
            <h2 className="text-2xl font-semibold">Tell {first} about your idea</h2>
            <Field label="Project title"><input required className={input} value={brief.title} onChange={(e) => setBrief({ title: e.target.value })} placeholder="e.g. Hotel lobby mural" /></Field>
            <Field label="What do you have in mind?"><textarea required rows={4} className={input} value={brief.description} onChange={(e) => setBrief({ description: e.target.value })} /></Field>
            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="Size or format"><input className={input} value={brief.size} onChange={(e) => setBrief({ size: e.target.value })} placeholder="3m × 2m" /></Field>
              <Field label="Budget"><input className={input} value={brief.budget} onChange={(e) => setBrief({ budget: e.target.value })} placeholder="K15,000" /></Field>
              <Field label="Deadline"><input type="date" className={input} value={brief.deadline} onChange={(e) => setBrief({ deadline: e.target.value })} /></Field>
            </div>
            <SiteButton type="submit">Send request<ArrowRight size={18} /></SiteButton>
          </form>
        )}
        {stage === 1 && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-semibold"><MessageSquare size={24} />{first} has a few questions</h2>
            <div className="rounded-2xl bg-secondary p-5 text-base leading-relaxed">“Is the wall indoors with natural light? Do you have colours from your interior I should work with?”</div>
            <textarea rows={3} className={input} placeholder="Your answer" />
            <SiteButton onClick={() => goTo(2)}>Answer & wait for proposal<ArrowRight size={18} /></SiteButton>
          </div>
        )}
        {(stage === 2 || stage === 3) && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-semibold"><FileText size={24} />Proposal{stage === 3 ? ' · revised' : ''}</h2>
            {stage === 3 && revisionNote && <p className="rounded-2xl bg-cream p-4 text-base">You asked: “{revisionNote}” — {first} updated the quote.</p>}
            <p className="text-base text-muted-foreground">{brief.title || 'Your commission'} · {brief.size || 'size to confirm'} · 6 weeks</p>
            <ul className="divide-y divide-border rounded-2xl border border-border">
              {projectMilestones.map((m) => <li key={m.title} className="flex justify-between gap-4 p-4 text-base"><span>{m.title} <span className="text-muted-foreground">· {m.share}</span></span><span className="font-medium">{m.amount}</span></li>)}
              <li className="flex justify-between p-4 text-lg font-semibold"><span>Total</span><span>K15,000</span></li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <SiteButton onClick={() => goTo(4)}>Accept proposal<ArrowRight size={18} /></SiteButton>
              {stage === 2 && <SiteButton variant="outline" onClick={() => note && requestRevision(note)}><RotateCcw size={18} />Request revision</SiteButton>}
            </div>
            {stage === 2 && <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What would you like changed?" />}
          </div>
        )}
        {(stage === 4 || stage === 5) && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-semibold"><Wallet size={24} />Pay the 30% deposit</h2>
            <p className="text-base text-muted-foreground">K4,500 is held safely and released to {first} when you approve the first milestone.</p>
            <SiteButton onClick={() => goTo(6)}>Pay K4,500 deposit (preview)<ArrowRight size={18} /></SiteButton>
          </div>
        )}
        {stage === 6 && (
          <div className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-semibold"><FolderOpen size={24} />Your project is ready</h2>
            <p className="text-base text-muted-foreground">Messages, files, milestones and payments now live in one shared workspace.</p>
            <div className="flex flex-wrap gap-3">
              <SiteButton href="/account/projects/hotel-lobby-mural">Open project workspace<ArrowRight size={18} /></SiteButton>
              <SiteButton variant="outline" onClick={reset}>Start another</SiteButton>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
