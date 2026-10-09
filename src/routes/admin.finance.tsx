import { createFileRoute } from '@tanstack/react-router';
import { GroupOverview } from '@/components/admin/group-overview';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/finance')({ head: () => pageHead('Finance', 'Finance overview — queues and open items.', true), component: () => <GroupOverview group="Finance" /> });
