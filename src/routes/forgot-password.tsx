import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell, AuthField, SubmitButton, simulate, emailOk } from "@/components/auth/kit";
import { SiteButton } from "@/components/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/forgot-password")({
  head: () => pageHead("Reset your password", "Request a password reset link for your I Am An Artist account."),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) return setErr("Enter a valid email address.");
    setErr(undefined); setBusy(true);
    await simulate();
    setBusy(false); setSent(true);
  };

  if (sent)
    return (
      <AuthShell note="on its way" title="Check your email." lede="We sent a password reset link if an account exists for that address. It may take a minute to arrive.">
        <div className="flex flex-col gap-3">
          <SiteButton variant="outline" onClick={() => setSent(false)} className="h-12 w-full py-0">Use a different email</SiteButton>
          <Link to="/login" className="mt-2 text-center text-sm text-muted-foreground hover:text-foreground">Back to sign in</Link>
        </div>
      </AuthShell>
    );

  return (
    <AuthShell
      note="it happens"
      title="Reset your password."
      lede="Enter the email linked to your account."
      footer={<>Remembered it? <Link to="/login" className="font-medium text-foreground link-line">Sign in</Link></>}
    >
      <form onSubmit={submit} noValidate>
        <AuthField label="Email" type="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
        <SubmitButton busy={busy} busyLabel="Sending…">Send reset link</SubmitButton>
      </form>
    </AuthShell>
  );
}
