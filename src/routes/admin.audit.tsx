import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/audit')({ head: () => pageHead('Audit Logs', 'Every staff action across the platform.', true), component: AuditLogs });

function AuditLogs() {
  const audit = useAdminOps((s) => s.audit);
  const [actor, setActor] = useState('all');
  const [resource, setResource] = useState('all');
  const actors = [...new Set(audit.map((a) => a.actor))];
  const resources = [...new Set(audit.map((a) => a.resource))];
  const rows = audit.filter((a) => (actor === 'all' || a.actor === actor) && (resource === 'all' || a.resource === resource));
  const href = (a: { resource: string; resourceId: string }) => (['payments', 'payouts', 'refunds', 'disputes', 'support', 'users', 'creators', 'works', 'orders', 'projects', 'services', 'bookings', 'verification', 'moderation', 'spaces'].includes(a.resource) ? `/admin/${a.resource}/${a.resourceId}` : `/admin/${a.resource}`);
  return (
    <AdminPage title="Audit Logs">
      <p className="max-w-2xl text-[15px] text-muted-foreground">Read-only. Every sensitive action records who did it, their role, when and why. Entries cannot be edited or deleted.</p>
      <div className="flex flex-wrap gap-3">
        <DropdownFilter label="Staff" value={actor} onChange={setActor} options={[{ value: 'all', label: 'All staff' }, ...actors.map((a) => ({ value: a, label: a }))]} />
        <DropdownFilter label="Area" value={resource} onChange={setResource} options={[{ value: 'all', label: 'All areas' }, ...resources.map((a) => ({ value: a, label: a }))]} />
      </div>
      <AdminTable
        columns={[
          { key: 'at', label: 'When' },
          { key: 'actor', label: 'Staff', render: (a) => <div><p className="font-medium">{a.actor}</p><p className="text-sm text-muted-foreground">{a.actorRole}</p></div> },
          { key: 'action', label: 'Action', render: (a) => <div><p className="font-medium">{a.action}</p>{a.reason && <p className="text-sm text-muted-foreground">Reason: {a.reason}</p>}</div> },
          { key: 'resource', label: 'Record', render: (a) => <span className="capitalize">{a.resource} · {a.resourceId}</span> },
        ]}
        rows={rows}
        hrefFor={href}
        emptyTitle="No actions match these filters."
      />
    </AdminPage>
  );
}
