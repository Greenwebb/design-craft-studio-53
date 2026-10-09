import { createFileRoute } from '@tanstack/react-router';
import { GroupOverview } from '@/components/admin/group-overview';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/marketplace')({ head: () => pageHead('Marketplace', 'Marketplace overview — queues and open items.', true), component: () => <GroupOverview group="Marketplace" /> });
