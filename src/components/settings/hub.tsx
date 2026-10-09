import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  User, Palette, Shield, Bell, Wallet, SlidersHorizontal, Lock, ChevronRight, ChevronLeft,
  ArrowUpRight, ShoppingBag, LogOut, Laptop, Smartphone,
} from "lucide-react";
import { SiteButton } from "@/components/site";
import { AuthField, PasswordField, FormNotice, simulate } from "@/components/auth/kit";
import { useEcosystem } from "@/components/ecosystem/context";
import { supabase } from "@/integrations/supabase/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Select as UiSelect, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CreditCard, Plus, Pencil, Trash2, X, Star } from "lucide-react";

export type SettingsContext = "creator" | "customer";
export type SettingsPage = "account" | "profile" | "security" | "notifications" | "payouts" | "payments" | "preferences" | "privacy";
type Item = { id: SettingsPage; label: string; hint: string; icon: typeof User };

export function settingsItems(context: SettingsContext): Item[] {
  return [
    { id: "account", label: "Account", hint: "Email, name and status", icon: User },
    ...(context === "creator" ? [{ id: "profile" as const, label: "Profile", hint: "Your public creator presence", icon: Palette }] : [{ id: "profile" as const, label: "Profile", hint: "Name, contact and delivery", icon: Palette }]),
    { id: "security", label: "Security", hint: "Password and devices", icon: Shield },
    { id: "notifications", label: "Notifications", hint: "What we tell you, and how", icon: Bell },
    context === "creator"
      ? { id: "payouts", label: "Payouts", hint: "Bank or mobile money", icon: Wallet }
      : { id: "payments", label: "Payments", hint: "Methods and receipts", icon: Wallet },
    { id: "preferences", label: "Preferences", hint: "Language and currency", icon: SlidersHorizontal },
    { id: "privacy", label: "Privacy", hint: "Visibility and your data", icon: Lock },
  ];
}
export const settingsTitles: Record<string, string> = { account: "Account", profile: "Profile", security: "Security", notifications: "Notifications", payouts: "Payouts", payments: "Payments", preferences: "Preferences", privacy: "Privacy" };

function useLinks(context: SettingsContext, artist?: string) {
  return (page?: SettingsPage) =>
    context === "creator"
      ? page ? ({ to: "/creator/settings/$page", params: { page }, search: { artist: artist ?? "painter" } } as const) : ({ to: "/creator/settings", search: { artist: artist ?? "painter" } } as const)
      : page ? ({ to: "/account/settings/$page", params: { page } } as const) : ({ to: "/account/settings" } as const);
}

export function useSignOut() {
  const navigate = useNavigate();
  return async () => { await supabase.auth.signOut().catch(() => undefined); void navigate({ to: "/login" }); };
}

/** Mobile-first stacked hub: Profile tab on phones, Settings index on desktop. */
export function SettingsHub({ context, artist, portrait }: { context: SettingsContext; artist?: string; portrait?: string }) {
  const { user, setContext } = useEcosystem();
  const link = useLinks(context, artist);
  const signOut = useSignOut();
  const isCreator = user.roles.includes("creator");
  const rowCls = "flex min-h-[64px] items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-secondary";
  return (
    <div className="mx-auto max-w-[640px]">
      <div className="flex flex-col items-center text-center">
        {portrait ? <img src={portrait} alt="" className="h-20 w-20 rounded-full object-cover" /> : <span className="grid h-20 w-20 place-items-center rounded-full bg-secondary text-2xl font-semibold">{user.displayName[0]}</span>}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{user.displayName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{context === "creator" ? "Creator" : "Collector"} · Settings</p>
        {context === "creator" && user.creatorProfile && (
          <Link to="/artists/$slug" params={{ slug: user.creatorProfile.slug }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium">View public profile<ArrowUpRight size={16} /></Link>
        )}
      </div>
      <nav aria-label="Settings" className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-background">
        {settingsItems(context).map((i) => (
          <Link key={i.id} {...link(i.id)} className={rowCls}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary"><i.icon size={19} /></span>
            <span className="flex-1"><span className="block text-[15px] font-medium">{i.label}</span><span className="block text-xs text-muted-foreground">{i.hint}</span></span>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Link>
        ))}
      </nav>
      <div className="mt-5 divide-y divide-border overflow-hidden rounded-3xl border border-border">
        {context === "creator" ? (
          <Link to="/account" onClick={() => setContext("customer")} className={rowCls}><ShoppingBag size={19} /><span className="flex-1 text-[15px] font-medium">Switch to Buying</span><ChevronRight size={18} className="text-muted-foreground" /></Link>
        ) : isCreator ? (
          <Link to="/creator" search={{ artist: "painter" }} onClick={() => setContext("creator")} className={rowCls}><Palette size={19} /><span className="flex-1 text-[15px] font-medium">Switch to Creating</span><ChevronRight size={18} className="text-muted-foreground" /></Link>
        ) : (
          <Link to="/join" className={rowCls}><Palette size={19} /><span className="flex-1 text-[15px] font-medium">Join as an Artist</span><ChevronRight size={18} className="text-muted-foreground" /></Link>
        )}
        <button type="button" onClick={() => void signOut()} className={`${rowCls} w-full text-destructive`}><LogOut size={19} /><span className="flex-1 text-[15px] font-medium">Sign out</span></button>
      </div>
    </div>
  );
}

/** One settings page with desktop side navigation and a native-feeling back bar on phones. */
export function SettingsPageView({ context, page, artist, portrait, artistName }: { context: SettingsContext; page: string; artist?: string; portrait?: string; artistName?: string }) {
  const items = settingsItems(context);
  const link = useLinks(context, artist);
  const valid = items.some((i) => i.id === page);
  return (
    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <p className="mb-4 px-4 text-[12px] uppercase text-muted-foreground">Settings</p>
        <nav aria-label="Settings sections" className="space-y-1">
          {items.map((i) => (
            <Link key={i.id} {...link(i.id)} aria-current={page === i.id ? "page" : undefined} className={`flex h-11 items-center gap-3 rounded-full px-4 text-sm ${page === i.id ? "bg-ink text-paper" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><i.icon size={18} />{i.label}</Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 max-w-[680px]">
        <Link {...link()} className="mb-6 inline-flex items-center gap-1 text-sm font-medium lg:hidden"><ChevronLeft size={20} />Settings</Link>
        <h1 className="text-3xl font-semibold tracking-tight">{settingsTitles[page] ?? "Settings"}</h1>
        <div className="mt-8">
          {!valid ? <p className="text-muted-foreground">This settings page doesn't exist.</p> : <Body context={context} page={page as SettingsPage} portrait={portrait} artistName={artistName} />}
        </div>
      </div>
    </div>
  );
}

function Block({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return <section className="border-t border-border py-8 first:border-t-0 first:pt-0"><h2 className="text-lg font-semibold">{title}</h2>{lede && <p className="mt-1 text-sm text-muted-foreground">{lede}</p>}<div className="mt-5">{children}</div></section>;
}
function Toggle({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-studio-green" : "bg-border"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-all ${on ? "left-[22px]" : "left-0.5"}`} /></button>;
}
function Select({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  const [inner, setInner] = useState(options[0] ?? "");
  const v = value ?? inner;
  return <div className="mb-5"><span className="mb-2 block text-sm font-medium">{label}</span>
    <UiSelect value={v} onValueChange={(x) => { setInner(x); onChange?.(x); }}>
      <SelectTrigger aria-label={label} className="h-12 rounded-full border-border bg-background px-5 text-[15px]"><SelectValue /></SelectTrigger>
      <SelectContent position="popper" sideOffset={8} className="rounded-3xl border-border bg-background p-1.5 shadow-xl">
        {options.map((o) => <SelectItem key={o} value={o} className="rounded-full py-2.5 pl-8 text-[15px]">{o}</SelectItem>)}
      </SelectContent>
    </UiSelect></div>;
}

type Method = { id: string; kind: string; label: string; detail: string; primary: boolean };
function MethodsManager({ title, kinds, initial }: { title: string; kinds: string[]; initial: Method[] }) {
  const [items, setItems] = useState<Method[]>(initial);
  const [edit, setEdit] = useState<Method | null>(null);
  const [del, setDel] = useState<Method | null>(null);
  const blank = (): Method => ({ id: "", kind: kinds[0] ?? "", label: "", detail: "", primary: items.length === 0 });
  const save = () => {
    if (!edit || !edit.label.trim() || !edit.detail.trim()) return;
    setItems((list) => {
      let next = edit.id ? list.map((m) => (m.id === edit.id ? edit : m)) : [...list, { ...edit, id: crypto.randomUUID() }];
      if (edit.primary) { const id = edit.id || next[next.length - 1]!.id; next = next.map((m) => ({ ...m, primary: m.id === id })); }
      return next;
    });
    setEdit(null);
  };
  const remove = (m: Method) => { setItems((list) => { const rest = list.filter((x) => x.id !== m.id); if (m.primary && rest[0]) rest[0] = { ...rest[0], primary: true }; return rest; }); setDel(null); };
  const panel = "fixed inset-x-0 bottom-0 z-50 max-h-[90svh] overflow-y-auto rounded-t-[28px] bg-background p-6 outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(480px,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:p-8 sm:shadow-2xl";
  return <>
    <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-semibold">{title}</h2><SiteButton onClick={() => setEdit(blank())} className="h-10 px-4 py-0"><Plus size={18} />Add</SiteButton></div>
    {items.length === 0 ? (
      <div className="mt-5 rounded-3xl border border-dashed border-border px-6 py-10 text-center"><CreditCard className="mx-auto text-muted-foreground" size={28} /><p className="mt-3 text-sm text-muted-foreground">Nothing added yet.</p></div>
    ) : (
      <ul className="mt-5 divide-y divide-border overflow-hidden rounded-3xl border border-border">
        {items.map((m) => <li key={m.id} className="flex items-center gap-4 px-5 py-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary"><CreditCard size={19} /></span>
          <div className="min-w-0 flex-1"><p className="flex flex-wrap items-center gap-2 text-[15px] font-medium">{m.label}{m.primary && <span className="rounded-full bg-studio-green/10 px-2.5 py-0.5 text-xs text-studio-green">Default</span>}</p><p className="truncate text-xs text-muted-foreground">{m.kind} · {m.detail}</p></div>
          {!m.primary && <button type="button" aria-label={`Make ${m.label} default`} title="Make default" onClick={() => setItems((l) => l.map((x) => ({ ...x, primary: x.id === m.id })))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><Star size={17} /></button>}
          <button type="button" aria-label={`Edit ${m.label}`} onClick={() => setEdit(m)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><Pencil size={17} /></button>
          <button type="button" aria-label={`Remove ${m.label}`} onClick={() => setDel(m)} className="grid h-9 w-9 place-items-center rounded-full text-destructive hover:bg-secondary"><Trash2 size={17} /></button>
        </li>)}
      </ul>
    )}
    <Dialog.Root open={!!edit} onOpenChange={(o) => !o && setEdit(null)}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35" /><Dialog.Content className={panel}>
      <Dialog.Title className="text-xl font-semibold">{edit?.id ? "Edit method" : "Add a method"}</Dialog.Title>
      <Dialog.Description className="mt-1 text-sm text-muted-foreground">Preview only · nothing is charged or stored.</Dialog.Description>
      <Dialog.Close asChild><button type="button" aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><X size={19} /></button></Dialog.Close>
      {edit && <div className="mt-6">
        <Select label="Type" options={kinds} value={edit.kind} onChange={(kind) => setEdit({ ...edit, kind })} />
        <AuthField label="Name" placeholder="e.g. Personal card" value={edit.label} onChange={(e) => setEdit({ ...edit, label: e.target.value })} />
        <AuthField label={edit.kind.includes("Card") ? "Card number" : edit.kind.includes("Bank") ? "Account number" : "Phone number"} value={edit.detail} onChange={(e) => setEdit({ ...edit, detail: e.target.value })} />
        <label className="mb-6 flex items-center justify-between text-[15px]">Use as default<input type="checkbox" checked={edit.primary} onChange={(e) => setEdit({ ...edit, primary: e.target.checked })} className="h-5 w-5 accent-[var(--studio-green)]" /></label>
        <SiteButton onClick={save} disabled={!edit.label.trim() || !edit.detail.trim()} className="h-12 w-full py-0">{edit.id ? "Save changes" : "Add method"}</SiteButton>
      </div>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
    <Dialog.Root open={!!del} onOpenChange={(o) => !o && setDel(null)}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35" /><Dialog.Content className={panel}>
      <Dialog.Title className="text-xl font-semibold">Remove {del?.label}?</Dialog.Title>
      <Dialog.Description className="mt-2 text-sm text-muted-foreground">You can add it again anytime.</Dialog.Description>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse"><SiteButton onClick={() => del && remove(del)} className="h-12 py-0">Remove</SiteButton><SiteButton variant="outline" onClick={() => setDel(null)} className="h-12 py-0">Cancel</SiteButton></div>
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
function Area({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return <label className="mb-5 block"><span className="mb-2 block text-sm font-medium">{label}</span><textarea defaultValue={defaultValue} rows={4} className="w-full rounded-3xl border border-border bg-background px-5 py-4 text-[15px] outline-none focus:border-foreground" /></label>;
}
function SaveBar() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const save = async () => { setState("busy"); await simulate(); setState("done"); };
  return (
    <div className="sticky bottom-[96px] z-10 -mx-[18px] mt-6 border-t border-border bg-background/95 px-[18px] py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
      <SiteButton onClick={save} disabled={state === "busy"} className="h-12 w-full py-0 sm:w-auto">{state === "busy" ? "Saving…" : state === "done" ? "Saved" : "Save changes"}</SiteButton>
    </div>
  );
}

function Body({ context, page, portrait, artistName }: { context: SettingsContext; page: SettingsPage; portrait?: string | undefined; artistName?: string | undefined }) {
  const { user } = useEcosystem();
  const signOut = useSignOut();
  const [msg, setMsg] = useState<string | null>(null);
  const preview = <p className="mb-6 rounded-3xl bg-secondary px-5 py-3 text-xs text-muted-foreground">Preview · changes aren't saved yet.</p>;
  switch (page) {
    case "account":
      return <>{preview}
        <Block title="Your details">
          <AuthField label="Account name" defaultValue={user.displayName} />
          <AuthField label="Email" type="email" defaultValue="you@example.com" hint="Verified" />
          <AuthField label="Phone (optional)" type="tel" placeholder="+260…" />
          <Select label="Language" options={["English", "Bemba", "Nyanja", "French"]} />
          <p className="text-sm">Account status: <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">Active</span></p>
          <SaveBar />
        </Block>
        <Block title="Sessions" lede="Signed in somewhere you don't recognise?">
          {msg && <FormNotice tone="info">{msg}</FormNotice>}
          <SiteButton variant="outline" onClick={async () => { await simulate(); setMsg("Other devices have been signed out."); }} className="h-12 py-0">Sign out other sessions</SiteButton>
        </Block>
        <Block title="Leave I Am An Artist" lede="Deactivating hides your account. Deleting removes it for good.">
          <div className="flex flex-wrap gap-3"><SiteButton variant="outline" className="h-12 py-0">Deactivate account</SiteButton><SiteButton variant="outline" className="h-12 py-0 text-destructive">Delete account</SiteButton></div>
        </Block>
        <div className="lg:hidden"><SiteButton variant="outline" onClick={() => void signOut()} className="h-12 w-full py-0">Sign out</SiteButton></div>
      </>;
    case "profile":
      if (context === "creator") return <>{preview}
        <Block title="Profile image">
          <div className="flex items-center gap-4">{portrait && <img src={portrait} alt="" className="h-16 w-16 rounded-full object-cover" />}<SiteButton variant="outline" className="h-11 py-0">Change photo</SiteButton></div>
        </Block>
        <Block title="About you">
          <AuthField label="Display name" defaultValue={user.displayName} />
          <AuthField label="Creative / professional name" defaultValue={artistName ?? user.displayName} />
          <Area label="Bio" defaultValue="I paint the light and colour of everyday Lusaka." />
          <AuthField label="Disciplines" defaultValue="Painter, Muralist" />
          <AuthField label="Location" defaultValue="Lusaka, Zambia" />
          <Select label="Availability" options={["Open to commissions", "Booking from next month", "Not taking work"]} />
          <AuthField label="Instagram" placeholder="@yourname" />
          <AuthField label="Website" placeholder="https://" />
        </Block>
        <Block title="Profile sections" lede="Choose what appears on your public page.">
          {["Portfolio", "Works for sale", "Services", "Reviews"].map((s) => <div key={s} className="flex items-center justify-between py-3 text-[15px]">{s}<Toggle label={s} /></div>)}
        </Block>
        <Block title="Public profile preview" lede="See your page the way collectors do.">
          {user.creatorProfile && <Link to="/artists/$slug" params={{ slug: user.creatorProfile.slug }} className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium">View public profile<ArrowUpRight size={16} /></Link>}
        </Block>
        <SaveBar />
      </>;
      return <>{preview}
        <Block title="Your details">
          <AuthField label="Display name" defaultValue={user.displayName} />
          <AuthField label="Contact email" type="email" defaultValue="you@example.com" />
          <AuthField label="Phone" type="tel" placeholder="+260…" />
        </Block>
        <Block title="Delivery addresses">
          <div className="rounded-3xl border border-border p-5 text-sm"><p className="font-medium">Home</p><p className="mt-1 text-muted-foreground">Plot 12, Kabulonga Road, Lusaka</p></div>
          <SiteButton variant="outline" className="mt-4 h-11 py-0">Add an address</SiteButton>
        </Block>
        <SaveBar />
      </>;
    case "security":
      return <>
        <Block title="Password"><PasswordField label="Current password" autoComplete="current-password" /><PasswordField label="New password" autoComplete="new-password" showRules /><SaveBar /></Block>
        <Block title="Email verification"><p className="text-sm">you@example.com · <span className="font-medium text-studio-green">Verified</span></p></Block>
        <Block title="Active sessions">
          <ul className="divide-y divide-border rounded-3xl border border-border">
            {[{ i: Laptop, d: "Chrome on macOS", w: "This device" }, { i: Smartphone, d: "Safari on iPhone", w: "2 days ago" }].map((s) => <li key={s.d} className="flex items-center gap-4 px-5 py-4"><s.i size={19} /><span className="flex-1 text-sm">{s.d}</span><span className="text-xs text-muted-foreground">{s.w}</span></li>)}
          </ul>
          <SiteButton variant="outline" className="mt-4 h-12 py-0">Sign out other devices</SiteButton>
        </Block>
        <Block title="Two-step verification"><p className="text-sm text-muted-foreground">Coming soon.</p></Block>
      </>;
    case "notifications": {
      const topics = context === "creator" ? ["Orders", "Projects", "Messages", "Payments", "Payouts", "Reviews", "Marketing"] : ["Orders", "Projects", "Messages", "Payments", "Reviews", "Artist updates", "Marketing"];
      return <>
        <div className="overflow-x-auto rounded-3xl border border-border">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="px-5 py-3 font-medium">Topic</th><th className="px-3 py-3 font-medium">In-app</th><th className="px-3 py-3 font-medium">Email</th><th className="px-3 py-3 font-medium">SMS</th></tr></thead>
            <tbody>{topics.map((t) => <tr key={t} className="border-b border-border last:border-0"><td className="px-5 py-4 font-medium">{t}</td><td className="px-3"><Toggle label={`${t} in-app`} /></td><td className="px-3"><Toggle label={`${t} email`} defaultOn={t !== "Marketing"} /></td><td className="px-3"><Toggle label={`${t} SMS`} defaultOn={false} /></td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Push notifications are coming later.</p>
        <SaveBar />
      </>;
    }
    case "payouts":
      return <>{preview}
        <Block title="Payout methods" lede="Where your earnings are sent. The default receives each payout.">
          <MethodsManager title="Your payout methods" kinds={["Mobile money", "Bank transfer"]} initial={[{ id: "p1", kind: "Mobile money", label: "Airtel Money", detail: "+260 97 *** **21", primary: true }, { id: "p2", kind: "Bank transfer", label: "Zanaco savings", detail: "•••• 8812", primary: false }]} />
        </Block>
        <Block title="Verification"><p className="text-sm">Identity check · <span className="font-medium text-studio-green">Verified</span></p><p className="mt-2 text-sm">Payout status · <span className="font-medium">Active, paid weekly</span></p></Block>
      </>;
    case "payments":
      return <>{preview}
        <Block title="Payment methods" lede="Choose how you pay for works and commissions.">
          <MethodsManager title="Saved methods" kinds={["Card", "Mobile money", "Bank transfer"]} initial={[{ id: "c1", kind: "Card", label: "Visa", detail: "•••• 4242 · expires 08/28", primary: true }, { id: "c2", kind: "Mobile money", label: "MTN MoMo", detail: "+260 96 *** **07", primary: false }]} />
        </Block>
        <Block title="Billing details"><AuthField label="Billing name" defaultValue={user.displayName} /><AuthField label="Billing address" defaultValue="Plot 12, Kabulonga Road, Lusaka" /><SaveBar /></Block>
        <Block title="Receipts"><Link to="/account/$section" params={{ section: "orders" }} className="text-sm font-medium underline underline-offset-4">See receipts in your orders</Link></Block>
      </>;
    case "preferences":
      return <><Select label="Language" options={["English", "Bemba", "Nyanja", "French"]} /><Select label="Show prices in" options={["ZMW · Kwacha", "USD · Dollar", "ZAR · Rand"]} /><Select label="Appearance" options={["Light"]} /><SaveBar /></>;
    case "privacy":
      return <>
        <Block title="Visibility">
          <div className="flex items-center justify-between py-2 text-[15px]">{context === "creator" ? "Show my profile in search" : "Show my collection to artists I work with"}<Toggle label="Visibility" /></div>
        </Block>
        <Block title="Your data"><p className="text-sm text-muted-foreground">Downloading a copy of your data is coming later.</p><p className="mt-2 text-sm text-muted-foreground">No blocked people.</p></Block>
        <Block title="Deactivate or delete" lede="You can come back to a deactivated account anytime."><div className="flex flex-wrap gap-3"><SiteButton variant="outline" className="h-12 py-0">Deactivate account</SiteButton><SiteButton variant="outline" className="h-12 py-0 text-destructive">Delete account</SiteButton></div></Block>
      </>;
  }
}
