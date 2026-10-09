import { createFileRoute } from "@tanstack/react-router";
import { SettingsHub } from "@/components/settings/hub";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/account/settings/")({
  head: () => pageHead("Settings — Your account", "Manage your account, delivery details, payments and privacy.", true),
  component: () => <SettingsHub context="customer" />,
});
