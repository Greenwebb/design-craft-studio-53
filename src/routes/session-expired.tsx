import { createFileRoute } from "@tanstack/react-router";
import { AuthShell, returnSearch } from "@/components/auth/kit";
import { SiteButton } from "@/components/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/session-expired")({
  validateSearch: returnSearch,
  head: () => pageHead("Session expired", "Sign in again to continue where you left off on I Am An Artist.", true),
  component: ExpiredPage,
});

function ExpiredPage() {
  const { returnTo } = Route.useSearch();
  const href = `/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  return (
    <AuthShell
      note="still here for you"
      title="Your session has expired."
      lede="Sign in again to continue where you left off. Your drafts and selections on this device are kept safe."
    >
      <SiteButton href={href} className="h-12 w-full py-0">Sign in</SiteButton>
      <a href="/" className="mt-5 block text-center text-sm text-muted-foreground hover:text-foreground">Keep browsing the gallery</a>
    </AuthShell>
  );
}
