import { createFileRoute, Outlet } from '@tanstack/react-router';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/spaces')({ head: () => pageHead('Art for Spaces', 'Curated art placements for businesses.', true), component: () => <Outlet /> });
