import { createFileRoute } from "@tanstack/react-router";
import { StudioShell } from "@/components/creator/shell";
import { previewStates, type PreviewState } from "@/data/creator";
export const Route = createFileRoute("/creator")({
  validateSearch: (search: Record<string, unknown>): { artist: PreviewState } => ({
    artist: previewStates.includes(search["artist"] as PreviewState)
      ? (search["artist"] as PreviewState)
      : "painter",
  }),
  component: DashboardLayout,
});
function DashboardLayout() {
  const { artist } = Route.useSearch();
  return <StudioShell state={artist} />;
}
