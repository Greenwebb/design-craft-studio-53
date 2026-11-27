import { createFileRoute } from "@tanstack/react-router";
import { ArtistVerificationPage, ArtistVerificationSkeleton } from "@/components/artist-verification/status-page";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/artist-verification")({
  validateSearch: (search: Record<string, unknown>): { mode?: "update" } =>
    search["mode"] === "update" ? { mode: "update" } : {},
  head: () =>
    pageHead(
      "Artist application",
      "Track your artist verification, provide requested information and follow your application on I Am An Artist.",
      true,
    ),
  component: ArtistVerificationRoute,
  pendingComponent: ArtistVerificationSkeleton,
});

function ArtistVerificationRoute() {
  const { mode } = Route.useSearch();
  return <ArtistVerificationPage mode={mode} />;
}
