import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { AdminPage, SectionCard, StatusPill } from '@/components/admin/admin-ui';
import { collectionSeed } from '@/data/admin-data';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/collections')({ head: () => pageHead('Collections', 'Curated marketplace collections.', true), component: Collections });

function Collections() {
  return (
    <AdminPage title="Collections" actions={<button className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-ink-foreground hover:bg-ink/90"><Plus size={18} />New collection</button>}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {collectionSeed.map((c) => (
          <div key={c.id} className="studio-panel studio-hover p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">{c.title}</h2><StatusPill state={c.state} />
            </div>
            <p className="mt-2 text-[15px] text-muted-foreground">{c.works} works · curated by {c.curator}</p>
            <p className="mt-1 text-sm text-muted-foreground">Updated {c.updated}</p>
          </div>
        ))}
      </div>
      <SectionCard title="Curator tools">
        <ul className="space-y-2 text-[15px] text-muted-foreground">
          <li>• Add or remove works, reorder the gallery and set a cover image.</li>
          <li>• Write the title, description and editorial text, then publish, schedule or archive.</li>
          <li>• Bulk actions are limited to safe operations such as publishing selected items.</li>
        </ul>
      </SectionCard>
    </AdminPage>
  );
}
