import { createFileRoute } from "@tanstack/react-router";
import { SettingsPageView, settingsTitles } from "@/components/settings/hub";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/account/settings/$page")({
  head: ({ params }) => pageHead(`${settingsTitles[params.page] ?? "Settings"} — Account settings`, `Manage your ${params.page} settings on I Am An Artist.`, true),
  component: Page,
});
function Page() {
  const { page } = Route.useParams();
  return <SettingsPageView key={page} context="customer" page={page} />;
}
