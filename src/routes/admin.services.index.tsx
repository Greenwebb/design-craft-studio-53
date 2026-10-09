import { createFileRoute } from '@tanstack/react-router';
import { AdminPage, AdminTable, StatusPill } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/services/')({ head: () => pageHead('Services', 'Service listings, pricing models and reports.', true), component: ServicesQueue });

function ServicesQueue() {
  const serviceSeed = useAdminOps((s) => s.services);
  return (
    <AdminPage title="Services">
      <AdminTable
        columns={[
          { key: 'title', label: 'Service', render: (s) => <div><p className="font-medium">{s.title}</p><p className="text-sm text-muted-foreground">{s.id} · {s.creator}</p></div> },
          { key: 'category', label: 'Category' },
          { key: 'pricing', label: 'Pricing' },
          { key: 'availability', label: 'Availability' },
          { key: 'orders', label: 'Orders', render: (s) => `${s.orders}${s.reports ? ` · ${s.reports} reports` : ''}` },
          { key: 'state', label: 'Status', render: (s) => <StatusPill state={s.state} /> },
        ]}
        rows={serviceSeed}
        hrefFor={(s) => `/admin/services/${s.id}`}
        emptyTitle="No services listed."
      />
      <p className="text-sm text-muted-foreground">Open a service to hide, restore or send it to moderation. Hidden services keep their history for appeal.</p>
    </AdminPage>
  );
}
