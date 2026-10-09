import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ActionsPanel, AdminDialog, AdminPage, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { currentStaff } from '@/data/admin-data';
import { useAdminOps } from '@/stores/admin-ops';
import { works } from '@/data/works';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/collections')({ head: () => pageHead('Collections', 'Curated marketplace collections.', true), component: Collections });

function Collections() {
  const rows = useAdminOps((s) => s.collections);
  const create = useAdminOps((s) => s.create);
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const states = ['draft', 'scheduled', 'published', 'archived'];
  const shown = rows.filter((c) => tab === 'all' || c.state === tab);
  const save = () => {
    create('collections', { id: `COL-${rows.length + 1}`, title: title.trim(), description: description.trim(), works: 0, curator: currentStaff.name, updated: 'Just now', state: 'draft' });
    setTitle(''); setDescription(''); setOpen(false);
  };
  return (
    <AdminPage title="Collections" actions={<button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-ink-foreground hover:bg-ink/90"><Plus size={18} />New collection</button>}>
      <FilterTabs value={tab} onChange={setTab} options={[{ value: 'all', label: 'All', count: rows.length }, ...states.map((s) => ({ value: s, label: s, count: rows.filter((r) => r.state === s).length }))]} />
      {shown.length === 0 && <p className="text-[15px] text-muted-foreground">No collections in this state.</p>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c, i) => (
          <article key={c.id} className="studio-panel overflow-hidden bg-background">
            <div className="grid h-36 grid-cols-3 gap-0.5 bg-secondary">
              {[0, 1, 2].map((k) => { const w = works[(i * 3 + k) % works.length]; return w ? <img key={k} src={w.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : null; })}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold">{c.title}</h2><StatusPill state={c.state} /></div>
              <p className="mt-1 text-[15px] text-muted-foreground">{c.works} works · {c.curator}</p>
              <p className="text-sm text-muted-foreground">Updated {c.updated}</p>
              <ActionsPanel resource="collections" record={c} className="mt-4" />
            </div>
          </article>
        ))}
      </div>
      <AdminDialog open={open} onOpenChange={setOpen} title="New collection" description="Starts as a draft. Add works and publish when ready.">
        <div className="space-y-4">
          <label className="block"><span className="text-sm font-medium">Title</span><input value={title} onChange={(e) => setTitle(e.target.value)} className="studio-input mt-2" placeholder="e.g. Morning Light" /></label>
          <label className="block"><span className="text-sm font-medium">Editorial text</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="studio-input mt-2 resize-none" /></label>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary">Cancel</button>
            <button type="button" disabled={title.trim().length < 3} onClick={save} className="rounded-full bg-ink px-6 py-3 font-medium text-ink-foreground disabled:opacity-40">Create draft</button>
          </div>
        </div>
      </AdminDialog>
    </AdminPage>
  );
}
