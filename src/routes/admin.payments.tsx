import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminPage, AdminTable, DropdownFilter, FilterTabs, StatusPill } from '@/components/admin/admin-ui';
import { money, paymentSeed } from '@/data/admin-data';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/payments')({ head: () => pageHead('Payments', 'Fintech operations console for incoming payments.', true), component: PaymentsQueue });

function PaymentsQueue() {
  const [tab, setTab] = useState('all');
  const [provider, setProvider] = useState('all');
  const counts = (s: string) => paymentSeed.filter((p) => p.state === s).length;
  const tabs = [
    { value: 'all', label: 'All', count: paymentSeed.length },
    { value: 'issues', label: 'Needs review', count: paymentSeed.filter((p) => p.issue || ['failed', 'chargeback'].includes(p.state)).length },
    ...['pending', 'processing', 'paid', 'failed', 'refunded', 'chargeback'].filter((s) => counts(s) > 0).map((s) => ({ value: s, label: s, count: counts(s) })),
  ];
  const rows = paymentSeed.filter((p) => (tab === 'all' || (tab === 'issues' ? !!p.issue || ['failed', 'chargeback'].includes(p.state) : p.state === tab)) && (provider === 'all' || p.provider.startsWith(provider)));
  return (
    <AdminPage title="Payments">
      <div className="flex flex-wrap items-center gap-3">
        <FilterTabs options={tabs} value={tab} onChange={setTab} />
        <DropdownFilter label="Provider" value={provider} onChange={setProvider} options={[
          { value: 'all', label: 'All providers' }, { value: 'Airtel', label: 'Airtel Money' }, { value: 'MTN', label: 'MTN MoMo' }, { value: 'Card', label: 'Card' },
        ]} />
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Payment', render: (p) => <div><p className="font-medium">{p.id}</p><p className="text-sm text-muted-foreground">{p.customer} · {p.date}</p></div> },
          { key: 'provider', label: 'Provider' },
          { key: 'amount', label: 'Amount', render: (p) => money(p.amount) },
          { key: 'linked', label: 'Linked', render: (p) => p.linkedKind === 'Order' ? <span className="text-studio-green">{p.linked}</span> : p.linked },
          { key: 'settlement', label: 'Settlement' },
          { key: 'state', label: 'Status', render: (p) => <div className="flex flex-col items-start gap-1.5"><StatusPill state={p.state} />{p.issue && <span className="max-w-56 text-[13px] text-studio-danger">{p.issue}</span>}</div> },
        ]}
        rows={rows}
        hrefFor={(p) => `/admin/payments/${p.id}`}
        emptyTitle="No payments match these filters."
      />
      <p className="text-sm text-muted-foreground">Payment records are immutable. Corrections are made with reversals or adjustments, never by editing values.</p>
    </AdminPage>
  );
}
