import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { AuthShell, AuthField, PasswordField, SubmitButton, GoogleButton, returnSearch, simulate, emailOk, passwordOk } from "@/components/auth/kit";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/signup")({
  validateSearch: returnSearch,
  head: () => pageHead("Create your account", "Save work you love, manage purchases and collaborate with artists on I Am An Artist."),
  component: SignupPage,
});

function SignupPage() {
  const { returnTo } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errs, setErrs] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errs = {};
    if (!emailOk(email)) next.email = "Enter a valid email address.";
    if (!passwordOk(password)) next.password = "Use at least 8 characters, including a number or symbol.";
    setErrs(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return pwRef.current?.focus();
    setBusy(true);
    await simulate();
    navigate({ to: "/verify-email", search: { email, ...(returnTo ? { returnTo } : {}) } });
  };

  return (
    <AuthShell
      note="start collecting"
      title="Create your account."
      lede="Save work you love, manage purchases and collaborate with artists."
      footer={
        <div className="space-y-3">
          <p>Already have an account? <Link to="/login" search={returnTo ? { returnTo } : {}} className="font-medium text-foreground link-line">Sign in</Link></p>
          <p>Are you an artist? <Link to="/join" className="font-medium text-foreground link-line">Join as an artist</Link> — build your profile first, save it at the end.</p>
        </div>
      }
    >
      <form onSubmit={submit} noValidate>
        <AuthField ref={emailRef} label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errs.email} />
        <PasswordField ref={pwRef} label="Password" autoComplete="new-password" showRules value={password} onChange={(e) => setPassword(e.target.value)} error={errs.password} />
        <div className="mt-2"><SubmitButton busy={busy} busyLabel="Creating account…">Create account</SubmitButton></div>
      </form>
      <GoogleButton returnTo={returnTo} />
    </AuthShell>
  );
}
