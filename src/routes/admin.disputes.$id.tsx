import { createFileRoute } from '@tanstack/react-router';
import { DisputeDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/disputes/$id')({
  head: () => pageHead('Dispute', 'Case detail, positions and actions.', true),
  component: () => <DisputeDetail id={Route.useParams().id} />,
});
