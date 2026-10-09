import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell, maskEmail, safeReturn, simulate } from "@/components/auth/kit";
import { SiteButton } from "@/components/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (s: Record<string, unknown>): { email?: string; returnTo?: string } => ({
    ...(typeof s["email"] === "string" ? { email: s["email"] } : {}),
    ...(() => { const r = safeReturn(s["returnTo"]); return r ? { returnTo: r } : {}; })(),
  }),
  head: () => pageHead("Check your inbox", "Verify your email address to finish setting up your I Am An Artist account.", true),
  component: VerifyPage,
});

function VerifyPage() {
  const { email, returnTo } = Route.useSearch();
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = async () => {
    setStatus(null); setCooldown(30);
    await simulate(500);
    setStatus("A new link is on its way.");
  };

  return (
    <AuthShell
      note="almost there"
      title="Check your inbox."
      lede={<>We sent a verification link to <span className="font-medium text-foreground">{email ? maskEmail(email) : "your email"}</span>. Open it on this device to continue.</>}
      footer={<>Already verified? <Link to="/login" search={returnTo ? { returnTo } : {}} className="font-medium text-foreground link-line">Sign in</Link></>}
    >
      <div className="flex flex-col gap-3">
        <SiteButton onClick={resend} disabled={cooldown > 0} className="h-12 w-full py-0 disabled:opacity-60">
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </SiteButton>
        <SiteButton href="/signup" variant="outline" className="h-12 w-full py-0">Change email</SiteButton>
        <p role="status" className="min-h-5 pt-2 text-center text-sm text-muted-foreground">{status}</p>
      </div>
    </AuthShell>
  );
}
