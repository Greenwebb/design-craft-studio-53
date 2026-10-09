import { useId, useState, type ReactNode, type ComponentProps } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { Logo, SiteButton } from "@/components/site";
import { lovable } from "@/integrations/lovable";
import heroArt from "@/assets/hero-art.jpg";

/** Only same-origin paths are accepted as return destinations. */
export function safeReturn(v: unknown): string | undefined {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : undefined;
}
export const returnSearch = (s: Record<string, unknown>): { returnTo?: string } => {
  const r = safeReturn(s["returnTo"]);
  return r ? { returnTo: r } : {};
};

/** Frontend preview: simulates a network round-trip until the external auth API is connected. */
export const simulate = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!u || !d) return email;
  return `${u[0]}${"•".repeat(Math.max(u.length - 1, 2))}@${d}`;
}

export function AuthShell({ note, title, lede, children, footer, art = true }: {
  note?: string; title: string; lede?: ReactNode; children: ReactNode; footer?: ReactNode; art?: boolean;
}) {
  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {art && (
        <aside className="relative hidden overflow-hidden bg-ink text-ink-foreground lg:block">
          <img src={heroArt} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Link to="/" aria-label="I Am An Artist home"><Logo className="h-12 invert" /></Link>
            <div className="max-w-sm">
              <p className="note text-2xl">one account, every side of art</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-foreground/75">
                Collect work you love, commission artists and run your creative space — with the same sign-in.
              </p>
            </div>
          </div>
        </aside>
      )}
      <div className="flex min-h-screen flex-col">
        <header className="flex h-[84px] items-center justify-between px-[18px] sm:px-8 lg:px-12">
          <Link to="/" aria-label="I Am An Artist home" className={art ? "lg:invisible" : ""}><Logo className="h-11" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Back to the gallery
          </Link>
        </header>
        <main className="flex flex-1 items-center px-[18px] pb-16 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[420px]">
            {note && <p className="note text-xl">{note}</p>}
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-[44px] sm:leading-[1.05]">{title}</h1>
            {lede && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{lede}</p>}
            <div className="mt-9">{children}</div>
            {footer && <div className="mt-10 text-sm text-muted-foreground">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}

type FieldProps = ComponentProps<"input"> & { label: string; error?: string; hint?: ReactNode };

export function AuthField({ label, error, hint, id, ...props }: FieldProps) {
  const gen = useId();
  const fid = id ?? gen;
  return (
    <div className="mb-6">
      <label htmlFor={fid} className="block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        id={fid}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-err` : undefined}
        className="h-[52px] w-full rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 text-[17px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground focus-visible:border-foreground aria-[invalid=true]:border-destructive"
        {...props}
      />
      {error ? <p id={`${fid}-err`} role="alert" className="mt-2 text-sm text-destructive">{error}</p> : hint}
    </div>
  );
}

export function PasswordField({ showRules, ...props }: FieldProps & { showRules?: boolean }) {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const gen = useId();
  const val = String(props.value ?? "");
  const rules = [
    { ok: val.length >= 8, t: "At least 8 characters" },
    { ok: /\d|[^A-Za-z]/.test(val), t: "A number or symbol" },
  ];
  return (
    <div className="relative">
      <AuthField
        id={gen}
        {...props}
        type={show ? "text" : "password"}
        onKeyUp={(e) => setCaps(e.getModifierState?.("CapsLock") ?? false)}
        hint={
          <>
            {caps && <p className="mt-2 text-sm text-muted-foreground">Caps Lock is on.</p>}
            {showRules && (
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                {rules.map((r) => (
                  <li key={r.t} className={`inline-flex items-center gap-1.5 ${r.ok ? "text-foreground" : ""}`}>
                    <Check size={13} className={r.ok ? "opacity-100" : "opacity-30"} /> {r.t}
                  </li>
                ))}
              </ul>
            )}
          </>
        }
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-0 top-[30px] grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export const passwordOk = (p: string) => p.length >= 8 && /\d|[^A-Za-z]/.test(p);
export const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function SubmitButton({ busy, children, busyLabel }: { busy?: boolean; children: ReactNode; busyLabel?: string }) {
  return (
    <SiteButton type="submit" disabled={busy} className="h-12 w-full py-0 disabled:opacity-60">
      {busy ? busyLabel ?? "One moment…" : children}
    </SiteButton>
  );
}

export function FormNotice({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`mb-6 rounded-2xl px-4 py-3 text-sm ${tone === "error" ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground"}`}>
      {children}
    </div>
  );
}

export function GoogleButton({ returnTo }: { returnTo?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const go = async () => {
    setBusy(true); setErr(false);
    if (returnTo) sessionStorage.setItem("auth.next", returnTo);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { setErr(true); setBusy(false); return; }
    if (r.redirected) return;
    window.location.assign(returnTo ?? "/account");
  };
  return (
    <>
      <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <SiteButton variant="outline" onClick={go} disabled={busy} className="h-12 w-full py-0">
        <GoogleMark /> {busy ? "Opening Google…" : "Continue with Google"}
      </SiteButton>
      {err && <p role="alert" className="mt-3 text-sm text-destructive">We couldn't open Google sign-in. Please try again.</p>}
    </>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}
