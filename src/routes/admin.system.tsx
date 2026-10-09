import { createFileRoute } from '@tanstack/react-router';
import { GroupOverview } from '@/components/admin/group-overview';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/system')({ head: () => pageHead('System', 'System overview — queues and open items.', true), component: () => <GroupOverview group="System" /> });
