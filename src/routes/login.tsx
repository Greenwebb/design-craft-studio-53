import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { AuthShell, AuthField, PasswordField, SubmitButton, FormNotice, GoogleButton, returnSearch, simulate, emailOk } from "@/components/auth/kit";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/login")({
  validateSearch: returnSearch,
  head: () => pageHead("Sign in", "Sign in to continue to your collection, projects or creative space on I Am An Artist."),
  component: LoginPage,
});

function LoginPage() {
  const { returnTo } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errs, setErrs] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errs = {};
    if (!emailOk(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrs(next); setNotice(null);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return pwRef.current?.focus();
    setBusy(true);
    await simulate();
    setBusy(false);
    // Preview states until the account API is connected.
    if (email.startsWith("locked")) return setNotice("This account is temporarily locked after several attempts. Try again in 15 minutes or reset your password.");
    if (email.startsWith("unverified")) return navigate({ to: "/verify-email", search: { email } });
    if (password.length < 8) return setNotice("We couldn't sign you in with those details.");
    navigate({ to: returnTo ?? "/account" });
  };

  return (
    <AuthShell
      note="good to see you"
      title="Welcome back."
      lede="Sign in to continue to your collection, projects or creative space."
      footer={<>New here? <Link to="/signup" search={returnTo ? { returnTo } : {}} className="font-medium text-foreground link-line">Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {notice && <FormNotice>{notice}</FormNotice>}
        <AuthField ref={emailRef} label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} />
        <PasswordField ref={pwRef} label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errs.password} />
        <div className="-mt-2 mb-7 text-right">
          <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">Forgot password?</Link>
        </div>
        <SubmitButton busy={busy} busyLabel="Signing in…">Sign in</SubmitButton>
      </form>
      <GoogleButton returnTo={returnTo} />
    </AuthShell>
  );
}
