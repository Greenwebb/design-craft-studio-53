import { createFileRoute } from '@tanstack/react-router';
import { WorkDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/works/$id')({
  head: () => pageHead('Work', 'Listing detail.', true),
  component: () => <WorkDetail id={Route.useParams().id} />,
});
