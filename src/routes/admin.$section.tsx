import { createFileRoute, notFound } from '@tanstack/react-router';
import { adminSections, adminQueue } from '@/data/workflows';
import { StatusLabel } from '@/components/ecosystem/primitives';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/$section')({
  loader: ({ params }) => { const s = adminSections.find((x) => x.id === params.section); if (!s) throw notFound(); return { label: s.label, id: s.id }; },
  head: ({ loaderData }) => pageHead(`${loaderData?.label ?? 'Queue'} · Operations`, 'Internal operations queue.', true),
  component: Queue,
});

function Queue() {
  const { label, id } = Route.useLoaderData();
  const items = adminQueue[id] ?? [];
  return (
    <div>
      <h1 className="text-4xl font-semibold">{label}</h1>
      <p className="mt-2 text-base text-muted-foreground">Preview queue — actions are not connected yet.</p>
      <ul className="mt-8 space-y-3">
        {items.map((i) => (
          <li key={i.id} className="studio-panel grid gap-3 p-5 sm:grid-cols-[90px_1fr_auto] sm:items-center">
            <span className="text-sm font-medium text-muted-foreground">{i.id}</span>
            <div><p className="text-lg font-medium">{i.title}</p><p className="text-base text-muted-foreground">{i.who}</p></div>
            <StatusLabel>{i.state}</StatusLabel>
          </li>
        ))}
      </ul>
    </div>
  );
}
