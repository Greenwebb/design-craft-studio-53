import { createFileRoute } from '@tanstack/react-router';
import { PaymentDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/payments/$id')({
  head: () => pageHead('Payment', 'Immutable payment breakdown.', true),
  component: () => <PaymentDetail id={Route.useParams().id} />,
});
