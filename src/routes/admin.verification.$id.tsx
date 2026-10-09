import { createFileRoute } from '@tanstack/react-router';
import { VerificationDetail } from '@/components/admin/details';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/verification/$id')({
  head: () => pageHead('Verification', 'Submission detail.', true),
  component: () => <VerificationDetail id={Route.useParams().id} />,
});
