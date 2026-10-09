import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { Logo, SiteButton } from "@/components/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { next?: string } => {
    const next = typeof search["next"] === "string" ? search["next"] : undefined;
    return { next: next && next.startsWith("/") ? next : undefined };
  },
  head: () => pageHead("Sign in", "Sign in to I Am An Artist with your Google account."),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") void navigate({ to: next ?? "/account" });
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: next ?? "/account" });
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate, next]);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    if (next) sessionStorage.setItem("auth.next", next);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in could not be started. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    void navigate({ to: next ?? "/account" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-[92px] items-center justify-between px-[18px] sm:px-7 lg:px-10">
        <Link to="/" aria-label="I Am An Artist home">
          <Logo className="h-12" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to the gallery
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-[18px] pb-24">
        <div className="w-full max-w-[420px] text-center">
          <p className="note">welcome back</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            One account for the whole ecosystem.
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Sign in to collect work, message artists and run your creative studio — all from the
            same account.
          </p>
          <SiteButton
            onClick={signIn}
            disabled={busy}
            className="mt-9 h-12 w-full justify-center px-6 text-sm"
          >
            <GoogleMark />
            {busy ? "Opening Google…" : "Continue with Google"}
          </SiteButton>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            New here? Your account is created automatically the first time you sign in. Artists can
            open a studio from their account afterwards.
          </p>
        </div>
      </main>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
