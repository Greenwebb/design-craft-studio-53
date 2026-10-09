import { createFileRoute, Link } from '@tanstack/react-router';
import { AdminPage, AdminTable, StatusPill } from '@/components/admin/admin-ui';
import { money, walletSeed } from '@/data/admin-data';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/wallets')({ head: () => pageHead('Wallets', 'Creator balances and their ledger entries.', true), component: WalletsQueue });

function WalletsQueue() {
  return (
    <AdminPage title="Wallets">
      <AdminTable
        columns={[
          { key: 'creator', label: 'Creator', render: (w) => <div><p className="font-medium">{w.creator}</p><p className="text-sm text-muted-foreground">{w.id}</p></div> },
          { key: 'pending', label: 'Pending', render: (w) => money(w.pending) },
          { key: 'available', label: 'Available', render: (w) => money(w.available) },
          { key: 'onHold', label: 'On hold', render: (w) => w.onHold ? <span className="text-studio-copper">{money(w.onHold)}</span> : '—' },
          { key: 'lastPayout', label: 'Last payout' },
          { key: 'verification', label: 'Payout verification' },
        ]}
        rows={walletSeed}
        hrefFor={(w) => `/admin/wallets/${w.id}`}
        emptyTitle="No wallets."
      />
      <p className="text-sm text-muted-foreground">Balances are ledger-only and cannot be typed in. Every movement appears in the {<Link to="/admin/wallets/W-71" className="text-studio-green underline-offset-4 hover:underline">wallet ledger</Link>} with its source, state and — if manual — the acting staff member.</p>
    </AdminPage>
  );
}
