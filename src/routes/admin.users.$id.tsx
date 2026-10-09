import { createFileRoute } from '@tanstack/react-router';
import { UserDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/users/$id')({
  head: () => pageHead('User', 'Account detail.', true),
  component: () => <UserDetail id={Route.useParams().id} />,
});
