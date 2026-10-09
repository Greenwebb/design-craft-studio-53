import { createFileRoute } from '@tanstack/react-router';
import { RefundDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/refunds/$id')({
  head: () => pageHead('Refund', 'Refund detail and financial impact.', true),
  component: () => <RefundDetail id={Route.useParams().id} />,
});
