import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { useAdminOps } from '@/stores/admin-ops';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/verification/')({ head: () => pageHead('Verification', 'Identity, payout identity, business and profile checks.', true), component: VerificationQueue });

function VerificationQueue() {
  const verification = useAdminOps((s) => s.verification);
  const [tab, setTab] = useState('all');
  const counts = (s: string) => verification.filter((v) => v.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: verification.length },
    { value: 'submitted', label: 'Submitted', count: counts('submitted') },
    { value: 'under-review', label: 'Under review', count: counts('under-review') },
    { value: 'needs-info', label: 'Needs information', count: counts('needs-info') },
    { value: 'verified', label: 'Verified', count: counts('verified') },
    { value: 'rejected', label: 'Rejected', count: counts('rejected') },
  ];
  const rows = verification.filter((v) => tab === 'all' || v.state === tab);
  return (
    <AdminPage title="Verification">
      <FilterTabs options={tabs} value={tab} onChange={setTab} />
      <AdminTable
        columns={[
          { key: 'creator', label: 'Case', render: (v) => <div><p className="font-medium">{v.creator}</p><p className="text-sm text-muted-foreground">{v.id} · {v.type}</p></div> },
          { key: 'submitted', label: 'Submitted', render: (v) => <div>{v.submitted}{v.waiting && <p className="text-[13px] text-studio-copper">{v.waiting}</p>}</div> },
          { key: 'documents', label: 'Documents', render: (v) => `${v.documents.length} supplied` },
          { key: 'state', label: 'Status', render: (v) => <StatusPill state={v.state} /> },
        ]}
        rows={rows}
        hrefFor={(v) => `/admin/verification/${v.id}`}
        emptyTitle="No verifications in this queue."
        emptyDetail="You're all caught up."
      />
      <p className="text-sm text-muted-foreground">Identity, payout identity, business and professional-profile checks are treated as separate verifications.</p>
    </AdminPage>
  );
}
