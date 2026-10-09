import { createFileRoute } from '@tanstack/react-router';
import { PayoutDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/payouts/$id')({
  head: () => pageHead('Payout', 'Payout detail and actions.', true),
  component: () => <PayoutDetail id={Route.useParams().id} />,
});
