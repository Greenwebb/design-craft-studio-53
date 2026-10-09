import { createFileRoute } from '@tanstack/react-router';
import { CreatorDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/creators/$id')({
  head: () => pageHead('Creator', 'Creator detail.', true),
  component: () => <CreatorDetail id={Route.useParams().id} />,
});
