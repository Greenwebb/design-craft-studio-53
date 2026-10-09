import { createFileRoute } from '@tanstack/react-router';
import { StudioShell } from '@/components/dashboard/shell';
import { previewStates, type PreviewState } from '@/data/dashboard';
export const Route = createFileRoute('/dashboard')({validateSearch:(search:Record<string,unknown>):{artist:PreviewState}=>({artist:previewStates.includes(search['artist'] as PreviewState)?search['artist'] as PreviewState:'painter'}),component:DashboardLayout});
function DashboardLayout(){const {artist}=Route.useSearch();return <StudioShell state={artist}/>;}
