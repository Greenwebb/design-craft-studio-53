import { Logo } from "@/components/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Image as ImageIcon, Video, Music, FolderOpen, ShoppingBag, Brush, Briefcase, CalendarCheck } from "lucide-react";
import { EASE, SiteButton } from "@/components/site";
import { HeroProfile } from "@/components/artist-hero";
import type { Artist } from "@/data/artists";
import onboardArt from "@/assets/artist-1.jpg";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join as an Artist — I Am An Artist" },
      { name: "description", content: "Build your artist profile in minutes: show your work, tell your story, sell, and get hired." },
      { property: "og:title", content: "Join as an Artist — I Am An Artist" },
      { property: "og:description", content: "Create your professional creative presence on I Am An Artist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

/* ---------- data ---------- */
const DISCIPLINES = ["Visual Artist", "Painter", "Illustrator", "Sculptor", "Photographer", "Graphic Designer", "Fashion Designer", "Stylist", "Musician", "Singer", "Songwriter", "Producer", "DJ", "Dancer", "Choreographer", "Actor", "Filmmaker", "Videographer", "Animator", "Writer", "Poet", "Muralist", "Creative Director", "Performer", "Digital Artist"];

type Group = "visual" | "photo" | "music" | "movement" | "acting" | "film" | "design" | "fashion" | "writing";
const GROUP_OF: Record<string, Group> = {
  "Visual Artist": "visual", Painter: "visual", Sculptor: "visual", Muralist: "visual", "Digital Artist": "visual", Illustrator: "design",
  Photographer: "photo", Musician: "music", Singer: "music", Songwriter: "music", Producer: "music", DJ: "music",
  Dancer: "movement", Choreographer: "movement", Performer: "movement", Actor: "acting",
  Filmmaker: "film", Videographer: "film", Animator: "film", "Graphic Designer": "design", "Creative Director": "design",
  "Fashion Designer": "fashion", Stylist: "fashion", Writer: "writing", Poet: "writing",
};
const FOCUS: Record<Group, { q: string; opts: string[] }> = {
  visual: { q: "What best describes your work?", opts: ["Painting", "Mixed media", "Drawing", "Sculpture", "Digital", "Mural", "Installation"] },
  photo: { q: "What do you photograph?", opts: ["Portraits", "Fashion", "Events", "Hospitality", "Commercial", "Documentary", "Fine art"] },
  music: { q: "What do you create or perform?", opts: ["Vocals", "Songwriting", "Production", "Live performance", "Instrumental", "Jingles", "Session work"] },
  movement: { q: "What kind of movement work do you do?", opts: ["Live performance", "Choreography", "Workshops", "Music videos", "Contemporary", "Traditional"] },
  acting: { q: "Where do you perform?", opts: ["Film", "Television", "Theatre", "Commercials", "Voice over"] },
  film: { q: "What do you make?", opts: ["Short film", "Documentary", "Commercial", "Music video", "Animation", "Events"] },
  design: { q: "What do you design?", opts: ["Brand identity", "Illustration", "Art direction", "Packaging", "Campaigns", "Editorial"] },
  fashion: { q: "What is your fashion practice?", opts: ["Custom design", "Styling", "Creative direction", "Ready-to-wear", "Accessories"] },
  writing: { q: "What do you write?", opts: ["Poetry", "Fiction", "Copywriting", "Scripts", "Spoken word", "Journalism"] },
};
const EARN = [
  { k: "sellsWorks", t: "Sell my work", d: "Finished pieces, prints, editions or digital work.", I: ShoppingBag },
  { k: "acceptsCommissions", t: "Accept commissions", d: "Custom pieces made for a client.", I: Brush },
  { k: "offersServices", t: "Offer creative services", d: "Project-based skills like production, design or photography.", I: Briefcase },
  { k: "acceptsBookings", t: "Accept bookings", d: "Performances, sessions and appearances.", I: CalendarCheck },
] as const;
type Caps = Artist["capabilities"];
const AVAIL = ["Yes, I'm available", "Available for selected projects", "Not right now"];

type Data = {
  first: string; last: string; email: string; password: string;
  disciplines: string[]; custom: string; focus: string[];
  name: string; location: string; headline: string; bio: string;
  portrait: string; hero: string; heroPos: number;
  work: { kind: "image" | "video" | "audio" | "project"; title: string; year: string; type: string; img: string } | null;
  caps: Caps; availability: string; response: string;
};
const EMPTY: Data = {
  first: "", last: "", email: "", password: "", disciplines: [], custom: "", focus: [],
  name: "", location: "", headline: "", bio: "", portrait: "", hero: "", heroPos: 50, work: null,
  caps: { sellsWorks: false, acceptsCommissions: false, offersServices: false, acceptsBookings: false },
  availability: AVAIL[0]!, response: "Within 2 days",
};
const KEY = "iaaa-onboarding";

type StepId = "welcome" | "account" | "disciplines" | "focus" | "profile" | "media" | "work" | "earn" | "availability" | "preview" | "done";

/* ---------- small UI ---------- */
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
const inputCls = "mt-1 h-[52px] w-full border-0 border-b border-foreground/20 bg-transparent text-[17px] outline-none transition-colors focus:border-foreground";

function Option({ on, onClick, children, sub }: { on: boolean; onClick: () => void; children: ReactNode; sub?: string }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 border px-5 py-4 text-left transition-colors ${on ? "border-foreground bg-ink text-ink-foreground" : "border-border hover:border-foreground/40"}`}>
      <span><span className="block text-[15px] font-medium">{children}</span>{sub && <span className={`mt-1 block text-[13px] ${on ? "opacity-70" : "text-muted-foreground"}`}>{sub}</span>}</span>
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${on ? "border-ink-foreground bg-ink-foreground text-ink" : "border-foreground/30"}`}>{on && <Check className="h-3 w-3" />}</span>
    </button>
  );
}

function ImagePick({ value, onChange, label, aspect, pos }: { value: string; onChange: (v: string) => void; label: string; aspect: string; pos?: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const pick = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => { // downscale so the draft fits in browser storage
        const s = Math.min(1, 1200 / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        onChange(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };
  return (
    <div>
      <p className="text-[13px] font-medium">{label}</p>
      <button type="button" onClick={() => ref.current?.click()} className={`group relative mt-2 block w-full overflow-hidden bg-secondary ${aspect}`}>
        {value ? <img src={value} alt="" style={{ objectPosition: `50% ${pos ?? 50}%` }} className="h-full w-full object-cover" />
          : <span className="absolute inset-0 grid place-items-center text-sm text-muted-foreground"><span className="flex flex-col items-center gap-2"><Plus className="h-5 w-5" />Choose image</span></span>}
      </button>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {value && <button type="button" onClick={() => ref.current?.click()} className="link-line mt-3 text-sm font-medium">Change image</button>}
    </div>
  );
}

/* ---------- page ---------- */
function JoinPage() {
  const [d, setD] = useState<Data>(EMPTY);
  const [step, setStep] = useState<StepId>("welcome");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (s) { setD({ ...EMPTY, ...s.data }); setStep(s.step); } } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify({ step, data: { ...d, password: "" } })); setSaved(true); } catch { setSaved(false); }
    const t = setTimeout(() => setSaved(false), 1600);
    return () => clearTimeout(t);
  }, [d, step, loaded]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => { setD((p) => ({ ...p, [k]: v })); setError(""); };
  const toggle = (k: "disciplines" | "focus", v: string) => set(k, d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v]);

  const groups = useMemo(() => [...new Set(d.disciplines.map((x) => GROUP_OF[x]).filter(Boolean))] as Group[], [d.disciplines]);
  const isMusic = groups.includes("music") || groups.includes("movement") || groups.includes("acting");
  const needsAvail = d.caps.acceptsCommissions || d.caps.offersServices || d.caps.acceptsBookings;

  const flow: StepId[] = ["welcome", "account", "disciplines", ...(groups.length ? (["focus"] as StepId[]) : []), "profile", "media", "work", "earn", ...(needsAvail ? (["availability"] as StepId[]) : []), "preview", "done"];
  const idx = Math.max(0, flow.indexOf(step));
  const counted: StepId[] = flow.filter((s) => s !== "welcome" && s !== "done");
  const pos = counted.indexOf(step) + 1;

  const validate = (): string => {
    if (step === "account") {
      if (!d.first.trim() || !d.last.trim()) return "Please add your first and last name.";
      if (!/^\S+@\S+\.\S+$/.test(d.email)) return "Please enter a valid email address.";
      if (d.password.length < 8) return "Password needs at least 8 characters.";
    }
    if (step === "disciplines" && !d.disciplines.length && !d.custom.trim()) return "Choose at least one discipline.";
    if (step === "profile" && (!d.name.trim() || !d.location.trim() || !d.headline.trim())) return "Name, location and headline help people find you.";
    if (step === "earn" && !Object.values(d.caps).some(Boolean)) return "Choose at least one way to work with people.";
    return "";
  };
  const go = (n: number) => {
    if (n > 0) { const e = validate(); if (e) return setError(e); }
    setDir(n); setError("");
    const next = flow[Math.min(flow.length - 1, Math.max(0, idx + n))]!;
    setStep(next); window.scrollTo({ top: 0 });
  };
  const jump = (s: StepId) => { setDir(-1); setStep(s); };

  const disciplines = [...d.disciplines, ...(d.custom.trim() ? [d.custom.trim()] : [])];
  const preview: Artist = {
    slug: "preview", name: d.name || `${d.first} ${d.last}`.trim() || "Your name", location: d.location || "Your city",
    disciplines: disciplines.length ? disciplines : ["Artist"], shortStatement: d.headline || "Your headline appears here.", voiceNote: "in my own words",
    bio: [d.bio], portrait: d.portrait || onboardArt, heroMedia: d.hero || d.portrait || onboardArt,
    primaryCta: d.caps.acceptsCommissions ? "Commission artist" : d.caps.acceptsBookings ? "Book artist" : d.caps.offersServices ? "Start a project" : "View works",
    portfolio: [], services: needsAvail ? [{ title: "", description: "", delivery: "", cta: "" }] : [],
    availability: { available: d.availability !== AVAIL[2], label: needsAvail ? d.availability : "New works available" },
    capabilities: d.caps,
  };

  const L = LEFT[step];
  const variants = reduce ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : { enter: (k: number) => ({ opacity: 0, x: 40 * k }), center: { opacity: 1, x: 0 }, exit: (k: number) => ({ opacity: 0, x: -40 * k }) };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container-x flex h-[76px] items-center justify-between">
          <Link to="/" aria-label="I Am An Artist home"><Logo /></Link>
          <div className="flex items-center gap-6 text-sm">
            <span aria-live="polite" className={`text-[12px] text-muted-foreground transition-opacity ${saved && step !== "welcome" ? "opacity-100" : "opacity-0"}`}>Saved</span>
            {step !== "done" && <Link to="/" className="link-line font-medium">Save &amp; exit</Link>}
          </div>
        </div>
        {pos > 0 && <div className="h-[2px] bg-border"><motion.div className="h-full bg-foreground" animate={{ width: `${(pos / counted.length) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} /></div>}
      </header>

      {step === "preview" || step === "done" ? (
        <main className="flex-1">
          <div className="container-x pt-14">
            <p className="note -rotate-1">{step === "done" ? "welcome home" : "looks like you"}</p>
            <h1 className="display-lg mt-3 max-w-3xl">{step === "done" ? "You're in." : "Here's how people will meet you."}</h1>
            {step === "done" && <p className="mt-5 max-w-xl text-lg text-muted-foreground">Your creative home is live. Keep building it whenever you're ready.</p>}
          </div>
          <div className="mt-6 border-y border-border"><HeroProfile a={preview} preview /></div>
          {d.work?.title && (
            <div className="container-x py-12">
              <p className="eyebrow text-muted-foreground">First project</p>
              <div className="mt-4 flex items-center gap-5">
                {d.work.img && <img src={d.work.img} alt="" className="h-24 w-20 object-cover" />}
                <div><p className="note-title">{d.work.title}</p><p className="text-[13px] text-muted-foreground">{[d.work.type, d.work.year].filter(Boolean).join(" · ")}</p></div>
              </div>
            </div>
          )}
          <div className="container-x flex flex-wrap gap-3 pb-24 pt-6">
            {step === "preview" ? (
              <>
                <SiteButton onClick={() => { setDir(1); setStep("done"); window.scrollTo({ top: 0 }); }}>Publish profile <ArrowRight className="h-4 w-4" /></SiteButton>
                <SiteButton variant="outline" onClick={() => jump("profile")}>Edit</SiteButton>
              </>
            ) : (
              <>
                <SiteButton href="#top" onClick={() => window.scrollTo({ top: 300, behavior: "smooth" })}>View my profile <ArrowRight className="h-4 w-4" /></SiteButton>
                <SiteButton variant="outline" onClick={() => jump("work")}>Add more work</SiteButton>
                {(d.caps.offersServices || d.caps.acceptsBookings || d.caps.acceptsCommissions) && <SiteButton variant="outline" onClick={() => jump("earn")}>Add a service</SiteButton>}
                {d.caps.sellsWorks && <SiteButton variant="outline" onClick={() => jump("work")}>List your first work</SiteButton>}
              </>
            )}
          </div>
        </main>
      ) : (
        <main className="grid flex-1 lg:grid-cols-[40%_60%]">
          <aside className="border-border px-[18px] pb-4 pt-10 sm:px-7 lg:sticky lg:top-[78px] lg:h-[calc(100vh-78px)] lg:border-r lg:px-14 lg:pt-16">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex h-full flex-col">
                {pos > 0 && <p className="eyebrow text-muted-foreground">{String(pos).padStart(2, "0")} / {String(counted.length).padStart(2, "0")}</p>}
                <p className="note mt-6 -rotate-1">{L.note}</p>
                <h1 className={`mt-3 max-w-md font-semibold tracking-[-0.045em] ${step === "welcome" ? "display-lg" : "text-4xl leading-[1] md:text-5xl"}`}>{L.title(groups, isMusic)}</h1>
                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">{L.copy}</p>
                {step === "welcome" && <img src={onboardArt} alt="An artist in her studio" className="mt-10 hidden aspect-[4/3] w-full max-w-md object-cover lg:block" />}
              </motion.div>
            </AnimatePresence>
          </aside>

          <section className="px-[18px] pb-32 pt-6 sm:px-7 lg:px-16 lg:pt-16">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: EASE }} className="max-w-2xl">
                {step === "welcome" && (
                  <div className="flex flex-col gap-4 lg:pt-24">
                    <SiteButton onClick={() => go(1)} className="px-8">Get started <ArrowRight className="h-4 w-4" /></SiteButton>
                    <a href="/" className="link-line w-fit text-sm font-medium">I already have an account</a>
                    <p className="mt-6 text-[13px] text-muted-foreground">Takes about 5 minutes. You can finish later.</p>
                  </div>
                )}

                {step === "account" && (
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field label="First name"><input autoFocus className={inputCls} value={d.first} onChange={(e) => set("first", e.target.value)} autoComplete="given-name" /></Field>
                    <Field label="Last name"><input className={inputCls} value={d.last} onChange={(e) => set("last", e.target.value)} autoComplete="family-name" /></Field>
                    <div className="sm:col-span-2"><Field label="Email"><input type="email" className={inputCls} value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></Field></div>
                    <div className="sm:col-span-2"><Field label="Password" hint="At least 8 characters."><input type="password" className={inputCls} value={d.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" /></Field></div>
                  </div>
                )}

                {step === "disciplines" && (
                  <div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {DISCIPLINES.map((x) => <Option key={x} on={d.disciplines.includes(x)} onClick={() => toggle("disciplines", x)}>{x}</Option>)}
                    </div>
                    <div className="mt-8"><Field label="Add another discipline" hint="Optional — for anything not listed."><input className={inputCls} value={d.custom} onChange={(e) => set("custom", e.target.value)} placeholder="e.g. Ceramicist" /></Field></div>
                  </div>
                )}

                {step === "focus" && (
                  <div className="space-y-12">
                    {groups.map((g) => (
                      <fieldset key={g}>
                        {groups.length > 1 && <legend className="mb-4 text-lg font-semibold tracking-[-0.02em]">{FOCUS[g].q}</legend>}
                        <div className="grid gap-2 sm:grid-cols-2">
                          {FOCUS[g].opts.map((o) => <Option key={o} on={d.focus.includes(o)} onClick={() => toggle("focus", o)}>{o}</Option>)}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                )}

                {step === "profile" && (
                  <div className="space-y-8">
                    <Field label="Artist or professional name"><input className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder={`${d.first} ${d.last}`.trim()} /></Field>
                    <Field label="Location"><input className={inputCls} value={d.location} onChange={(e) => set("location", e.target.value)} placeholder="Lusaka, Zambia" /></Field>
                    <Field label="Short headline" hint={`${d.headline.length} / 120`}><input maxLength={120} className={inputCls} value={d.headline} onChange={(e) => set("headline", e.target.value)} placeholder={isMusic ? "Singer, songwriter and producer based in Lusaka." : "Painter exploring memory, place and everyday life."} /></Field>
                    <Field label="Short bio" hint={`${d.bio.length} / 800 · optional for now`}><textarea maxLength={800} rows={5} className={`${inputCls} h-auto resize-none py-3`} value={d.bio} onChange={(e) => set("bio", e.target.value)} /></Field>
                  </div>
                )}

                {step === "media" && (
                  <div className="grid gap-10 sm:grid-cols-[0.7fr_1.3fr]">
                    <ImagePick label="Profile photo" aspect="aspect-[4/5]" value={d.portrait} onChange={(v) => set("portrait", v)} />
                    <div>
                      <ImagePick label={isMusic ? "Hero image — a performance shot" : groups.includes("photo") ? "Hero image — a portfolio favourite" : "Hero image — your strongest work"} aspect="aspect-[4/5]" value={d.hero} pos={d.heroPos} onChange={(v) => set("hero", v)} />
                      {d.hero && <Field label="Reposition"><input type="range" min={0} max={100} value={d.heroPos} onChange={(e) => set("heroPos", +e.target.value)} className="mt-3 w-full accent-foreground" /></Field>}
                    </div>
                  </div>
                )}

                {step === "work" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {([["image", "Image", ImageIcon], ["video", "Video", Video], ["audio", "Audio", Music], ["project", "Project", FolderOpen]] as const).map(([k, t, I]) => (
                        <button key={k} type="button" aria-pressed={d.work?.kind === k} onClick={() => set("work", { title: "", year: "2026", type: "", img: "", ...d.work, kind: k })}
                          className={`flex flex-col items-start gap-6 border p-4 text-sm font-medium transition-colors ${d.work?.kind === k ? "border-foreground bg-ink text-ink-foreground" : "border-border hover:border-foreground/40"}`}>
                          <I className="h-5 w-5" />{t}
                        </button>
                      ))}
                    </div>
                    {d.work && (
                      <>
                        <div className="grid gap-8 sm:grid-cols-[1fr_120px]">
                          <Field label="Title"><input className={inputCls} value={d.work.title} onChange={(e) => set("work", { ...d.work!, title: e.target.value })} placeholder={isMusic ? "Stay" : "After the Rain"} /></Field>
                          <Field label="Year"><input inputMode="numeric" className={inputCls} value={d.work.year} onChange={(e) => set("work", { ...d.work!, year: e.target.value })} /></Field>
                        </div>
                        <Field label={d.work.kind === "audio" ? "Release type" : d.work.kind === "image" && !isMusic ? "Medium" : "Project type"}>
                          <input className={inputCls} value={d.work.type} onChange={(e) => set("work", { ...d.work!, type: e.target.value })} placeholder={d.work.kind === "audio" ? "Single" : isMusic ? "Live performance" : "Oil on canvas"} />
                        </Field>
                        <ImagePick label={d.work.kind === "image" ? "Image" : "Cover image"} aspect="aspect-[4/3]" value={d.work.img} onChange={(v) => set("work", { ...d.work!, img: v })} />
                      </>
                    )}
                  </div>
                )}

                {step === "earn" && (
                  <div className="space-y-2">
                    {EARN.map(({ k, t, d: desc }) => <Option key={k} on={d.caps[k]} sub={desc} onClick={() => set("caps", { ...d.caps, [k]: !d.caps[k] })}>{t}</Option>)}
                  </div>
                )}

                {step === "availability" && (
                  <div className="space-y-10">
                    <div role="radiogroup" className="space-y-2">
                      {AVAIL.map((a) => <Option key={a} on={d.availability === a} onClick={() => set("availability", a)}>{a}</Option>)}
                    </div>
                    <Field label="Typical response time">
                      <select className={inputCls} value={d.response} onChange={(e) => set("response", e.target.value)}>
                        {["Within a day", "Within 2 days", "Within a week"].map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </Field>
                  </div>
                )}

                {error && <p role="alert" className="mt-6 text-sm text-destructive">{error}</p>}

                {step !== "welcome" && (
                  <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-border bg-background/95 px-[18px] py-4 backdrop-blur-xl sm:px-7 lg:static lg:mt-14 lg:border-0 lg:bg-transparent lg:p-0">
                    <button onClick={() => go(-1)} className="inline-flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100"><ArrowLeft className="h-4 w-4" />Back</button>
                    <div className="flex items-center gap-5">
                      {step === "work" && <button onClick={() => { set("work", null); setDir(1); setStep(flow[idx + 1]!); }} className="link-line text-sm font-medium">Skip for now</button>}
                      <SiteButton onClick={() => go(1)}>
                        {flow[idx + 1] === "preview" ? "Preview profile" : "Continue"} <ArrowRight className="h-4 w-4" />
                      </SiteButton>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      )}
    </div>
  );
}

const LEFT: Record<StepId, { note: string; title: (g: Group[], music: boolean) => string; copy: string }> = {
  welcome: { note: "your work deserves a home", title: () => "Let's build your artist profile.", copy: "Create a professional space to show your work, tell your story, sell what you create and connect with people who want to work with you." },
  account: { note: "your story starts here", title: () => "First, the basics.", copy: "We'll use this to set up your account. Your email stays private." },
  disciplines: { note: "your work, your way", title: () => "What kind of artist are you?", copy: "Choose everything that describes your work. You can change this later." },
  focus: { note: "the details matter", title: (g) => (g.length === 1 ? FOCUS[g[0]!].q : "Tell us more about your focus."), copy: "This helps the right people find you." },
  profile: { note: "in your own words", title: () => "Let people meet the person behind the work.", copy: "A clear headline and a few honest lines go a long way." },
  media: { note: "a face to the work", title: () => "Show us who you are.", copy: "Choose an image that feels like you. This will be one of the first things people see on your profile." },
  work: { note: "start with one", title: (_g, m) => (m ? "Share something people can hear or see." : "Give people something to discover."), copy: "Add a first project now, or skip and add it later." },
  earn: { note: "on your terms", title: () => "How would you like people to work with you?", copy: "Choose what applies today. You can enable more options later." },
  availability: { note: "no calendars yet", title: () => "Are you currently available?", copy: "Just a simple signal for now. You can change it anytime." },
  preview: { note: "", title: () => "", copy: "" },
  done: { note: "", title: () => "", copy: "" },
};
