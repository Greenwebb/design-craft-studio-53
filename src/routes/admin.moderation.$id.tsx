import { createFileRoute } from '@tanstack/react-router';
import { ModerationDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/moderation/$id')({
  head: () => pageHead('Moderation case', 'Reported content and decisions.', true),
  component: () => <ModerationDetail id={Route.useParams().id} />,
});
