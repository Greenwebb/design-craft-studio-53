import { createFileRoute, redirect } from "@tanstack/react-router";
import { StudioShell } from "@/components/dashboard/shell";
import { previewStates, type PreviewState } from "@/data/dashboard";
import { canOpenCreatorDashboard, useArtistVerificationStore } from "@/stores/artist-verification";

export const Route = createFileRoute("/creator")({
  validateSearch: (search: Record<string, unknown>): { artist: PreviewState } => ({
    artist: previewStates.includes(search["artist"] as PreviewState)
      ? (search["artist"] as PreviewState)
      : "painter",
  }),
  beforeLoad: ({ search }) => {
    const status = useArtistVerificationStore.getState().application.status;
    if (!canOpenCreatorDashboard(search.artist, status)) {
      throw redirect({
        to: "/artist-verification",
        search: status === "requires_action" ? { mode: "update" } : {},
      });
    }
  },
  component: DashboardLayout,
});
function DashboardLayout() {
  const { artist } = Route.useSearch();
  return <StudioShell state={artist} />;
}
