import { createFileRoute } from '@tanstack/react-router';
import { WalletDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/wallets/$id')({
  head: () => pageHead('Wallet', 'Balance and ledger.', true),
  component: () => <WalletDetail id={Route.useParams().id} />,
});
