import { createFileRoute } from "@tanstack/react-router";
import { SettingsPageView, settingsTitles } from "@/components/settings/hub";
import { useStudio } from "@/components/dashboard/context";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/creator/settings/$page")({
  head: ({ params }) => pageHead(`${settingsTitles[params.page] ?? "Settings"} — Creator settings`, `Manage your ${params.page} settings on I Am An Artist.`, true),
  component: Page,
});
function Page() {
  const { page } = Route.useParams();
  const studio = useStudio();
  return <SettingsPageView key={page} context="creator" page={page} artist={studio.state} portrait={studio.artist.portrait} artistName={studio.artist.name} />;
}
