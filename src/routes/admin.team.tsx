import { createFileRoute, Outlet } from '@tanstack/react-router';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/team')({ head: () => pageHead('Team', 'Internal staff with access to operations.', true), component: () => <Outlet /> });
