import { createFileRoute } from "@tanstack/react-router";
import { SettingsHub } from "@/components/settings/hub";
import { useStudio } from "@/components/dashboard/context";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/creator/settings/")({
  head: () => pageHead("Settings — Creator", "Manage your account, creator profile, payouts and privacy.", true),
  component: Page,
});
function Page() {
  const studio = useStudio();
  return <SettingsHub context="creator" artist={studio.state} portrait={studio.artist.portrait} />;
}
