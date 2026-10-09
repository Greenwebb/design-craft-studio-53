import { createFileRoute } from '@tanstack/react-router';
import { GroupOverview } from '@/components/admin/group-overview';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/operations')({ head: () => pageHead('Operations', 'Operations overview — queues and open items.', true), component: () => <GroupOverview group="Operations" /> });
