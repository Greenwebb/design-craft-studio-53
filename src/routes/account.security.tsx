import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Laptop, Smartphone } from "lucide-react";
import { AuthField, PasswordField, FormNotice, simulate, passwordOk, emailOk } from "@/components/auth/kit";
import { SiteButton } from "@/components/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/account/security")({
  head: () => pageHead("Sign-in & security", "Manage your password, email and signed-in devices on I Am An Artist.", true),
  component: SecurityPage,
});

const SESSIONS = [
  { id: "1", icon: Laptop, device: "Chrome on macOS", place: "Lusaka, Zambia", when: "This device", current: true },
  { id: "2", icon: Smartphone, device: "Safari on iPhone", place: "Lusaka, Zambia", when: "2 days ago" },
  { id: "3", icon: Laptop, device: "Firefox on Windows", place: "Johannesburg, South Africa", when: "3 weeks ago" },
];

function Section({ title, lede, children }: { title: string; lede: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-border py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lede}</p>
      </div>
      <div className="max-w-[460px]">{children}</div>
    </section>
  );
}

function SecurityPage() {
  const [cur, setCur] = useState(""); const [pw, setPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const [sessions, setSessions] = useState(SESSIONS);
  const [busy, setBusy] = useState<string | null>(null);

  const changePw = async (e: FormEvent) => {
    e.preventDefault();
    if (!cur) return setPwMsg({ t: "Enter your current password to confirm it's you.", ok: false });
    if (!passwordOk(pw)) return setPwMsg({ t: "Use at least 8 characters, including a number or symbol.", ok: false });
    setBusy("pw"); await simulate(); setBusy(null);
    setCur(""); setPw(""); setPwMsg({ t: "Password updated.", ok: true });
  };
  const changeEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) return setEmailMsg({ t: "Enter a valid email address.", ok: false });
    setBusy("email"); await simulate(); setBusy(null);
    setEmailMsg({ t: `We sent a confirmation link to ${email}. Your email changes once you open it.`, ok: true }); setEmail("");
  };
  const signOutOthers = async () => {
    setBusy("sessions"); await simulate(); setBusy(null);
    setSessions((s) => s.filter((x) => x.current));
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-[18px] py-10 sm:px-8">
      <p className="note text-xl">keep it yours</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">Sign-in & security</h1>
      <p className="mt-3 max-w-xl text-[15px] text-muted-foreground">One account covers buying and creating, so these settings protect both.</p>

      <div className="mt-10">
        <Section title="Password" lede="Choose something you don't use anywhere else.">
          <form onSubmit={changePw} noValidate>
            {pwMsg && <FormNotice tone={pwMsg.ok ? "info" : "error"}>{pwMsg.t}</FormNotice>}
            <PasswordField label="Current password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} />
            <PasswordField label="New password" autoComplete="new-password" showRules value={pw} onChange={(e) => setPw(e.target.value)} />
            <SiteButton type="submit" disabled={busy === "pw"} className="h-12 py-0">{busy === "pw" ? "Updating…" : "Update password"}</SiteButton>
          </form>
        </Section>

        <Section title="Email address" lede="Used for sign-in, receipts and messages from artists.">
          <form onSubmit={changeEmail} noValidate>
            {emailMsg && <FormNotice tone={emailMsg.ok ? "info" : "error"}>{emailMsg.t}</FormNotice>}
            <AuthField label="New email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <SiteButton type="submit" disabled={busy === "email"} className="h-12 py-0">{busy === "email" ? "Sending…" : "Change email"}</SiteButton>
          </form>
        </Section>

        <Section title="Where you're signed in" lede="Don't recognise a device? Sign it out and update your password.">
          <ul className="divide-y divide-border rounded-3xl border border-border">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary"><s.icon size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">{s.place} · {s.when}</p>
                </div>
                {s.current && <span className="rounded-full bg-ink px-3 py-1 text-xs text-ink-foreground">Current</span>}
              </li>
            ))}
          </ul>
          {sessions.length > 1 && (
            <SiteButton variant="outline" onClick={signOutOthers} disabled={busy === "sessions"} className="mt-5 h-12 py-0">
              {busy === "sessions" ? "Signing out…" : "Sign out other devices"}
            </SiteButton>
          )}
        </Section>

        <Section title="Two-step verification" lede="An extra code when you sign in from a new device.">
          <p className="text-sm text-muted-foreground">Coming soon. We'll let you know when it's available.</p>
        </Section>
      </div>
    </div>
  );
}
