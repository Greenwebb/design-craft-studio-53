import { createFileRoute } from '@tanstack/react-router';
import { PublicShell } from '@/components/ecosystem/public-shell';
export const Route = createFileRoute('/_public')({ component: PublicShell });
