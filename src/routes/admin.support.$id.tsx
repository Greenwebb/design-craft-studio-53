import { createFileRoute } from '@tanstack/react-router';
import { SupportDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/support/$id')({
  head: () => pageHead('Support case', 'Case detail.', true),
  component: () => <SupportDetail id={Route.useParams().id} />,
});
