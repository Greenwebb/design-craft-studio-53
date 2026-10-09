import { createFileRoute } from '@tanstack/react-router';
import { OrderDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/orders/$id')({
  head: () => pageHead('Order', 'Order operations detail.', true),
  component: () => <OrderDetail id={Route.useParams().id} />,
});
