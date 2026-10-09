import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell, PasswordField, SubmitButton, FormNotice, simulate, passwordOk } from "@/components/auth/kit";
import { SiteButton } from "@/components/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>): { state?: "expired" | "invalid" } =>
    s["state"] === "expired" || s["state"] === "invalid" ? { state: s["state"] } : {},
  head: () => pageHead("Choose a new password", "Set a new password for your I Am An Artist account."),
  component: ResetPage,
});

function ResetPage() {
  const { state } = Route.useSearch();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errs, setErrs] = useState<{ pw?: string; confirm?: string }>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (state)
    return (
      <AuthShell
        note="let's try again"
        title={state === "expired" ? "This link has expired." : "This link doesn't work."}
        lede={state === "expired" ? "Reset links stay active for a short time to keep your account safe. Request a fresh one below." : "It may have been used already or copied incompletely. Request a new link to continue."}
      >
        <SiteButton href="/forgot-password" className="h-12 w-full py-0">Request a new link</SiteButton>
      </AuthShell>
    );

  if (done)
    return (
      <AuthShell note="all set" title="Password updated." lede="You can now sign in with your new password.">
        <SiteButton href="/login" className="h-12 w-full py-0">Continue to sign in</SiteButton>
      </AuthShell>
    );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errs = {};
    if (!passwordOk(pw)) next.pw = "Use at least 8 characters, including a number or symbol.";
    else if (pw !== confirm) next.confirm = "These passwords don't match yet.";
    setErrs(next);
    if (next.pw || next.confirm) return;
    setBusy(true); await simulate(); setBusy(false); setDone(true);
  };

  return (
    <AuthShell note="fresh start" title="Choose a new password." footer={<Link to="/login" className="hover:text-foreground">Back to sign in</Link>}>
      <form onSubmit={submit} noValidate>
        {errs.confirm && <FormNotice>{errs.confirm}</FormNotice>}
        <PasswordField label="New password" autoComplete="new-password" autoFocus showRules value={pw} onChange={(e) => setPw(e.target.value)} error={errs.pw} />
        <PasswordField label="Confirm password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <SubmitButton busy={busy} busyLabel="Updating…">Update password</SubmitButton>
      </form>
    </AuthShell>
  );
}
