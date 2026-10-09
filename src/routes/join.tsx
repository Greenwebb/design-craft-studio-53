import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Check, X, Palette, Camera, Music, Clapperboard, Shirt, Drama, PenTool, Feather, Sparkles,
  Image as ImageIcon, Video, AudioLines, FolderOpen, LayoutGrid, ShoppingBag, Brush, Briefcase, CalendarCheck, MapPin,
} from "lucide-react";
import { EASE, Logo, SiteButton } from "@/components/site";
import { HeroProfile } from "@/components/artist-hero";
import type { Artist } from "@/data/artists";
import placeholderArt from "@/assets/artist-1.jpg";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Create your creative space — I Am An Artist" },
      { name: "description", content: "Show your work, tell your story and open new ways for people to discover, collect, commission or work with you." },
      { property: "og:title", content: "Create your creative space — I Am An Artist" },
      { property: "og:description", content: "Build your creative presence on I Am An Artist in a few easy steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

/* ---------------- data ---------------- */
const CATEGORIES = [
  { k: "Visual Art", d: "Painting, illustration, sculpture, mixed media", I: Palette, label: "Visual Artist", subs: ["Painting", "Drawing", "Sculpture", "Mural", "Mixed media", "Digital art", "Installation"] },
  { k: "Photography", d: "Portraits, fashion, documentary, commercial", I: Camera, label: "Photographer", subs: ["Portrait", "Fashion", "Events", "Hospitality", "Commercial", "Fine art", "Documentary"] },
  { k: "Music", d: "Singing, production, songwriting, performance", I: Music, label: "Musician", subs: ["Singer", "Songwriter", "Producer", "Instrumentalist", "DJ", "Live performer", "Composer"] },
  { k: "Film & Video", d: "Directing, cinematography, editing, animation", I: Clapperboard, label: "Filmmaker", subs: ["Director", "Cinematographer", "Editor", "Animator", "Music videos", "Documentary"] },
  { k: "Fashion", d: "Design, styling, creative direction", I: Shirt, label: "Fashion Creative", subs: ["Designer", "Stylist", "Creative director", "Accessories", "Tailoring"] },
  { k: "Performance", d: "Dance, choreography, acting, live performance", I: Drama, label: "Performer", subs: ["Dancer", "Choreographer", "Actor", "Spoken word", "MC / Host", "Theatre"] },
  { k: "Design", d: "Graphic design, branding, digital design", I: PenTool, label: "Designer", subs: ["Brand identity", "Graphic design", "Illustration", "Digital / UI", "Packaging", "Art direction"] },
  { k: "Writing", d: "Poetry, books, scripts, storytelling", I: Feather, label: "Writer", subs: ["Poet", "Author", "Scriptwriter", "Copywriter", "Journalist", "Storyteller"] },
  { k: "Other", d: "Define your own creative discipline", I: Sparkles, label: "Creative", subs: [] },
] as const;
type Cat = (typeof CATEGORIES)[number]["k"];

const OFFERS = [
  { k: "portfolio", t: "My work", d: "Show my portfolio and projects", I: LayoutGrid, v: "The foundation of every profile — a place to show what you make." },
  { k: "sell", t: "Work available to buy", d: "Sell finished work", I: ShoppingBag, v: "Perfect for original work, prints, photography, editions and collectible pieces." },
  { k: "commission", t: "Custom commissions", d: "Create something specifically for a client", I: Brush, v: "Great for portraits, murals, custom songs, bespoke fashion and personal pieces." },
  { k: "services", t: "Creative services", d: "Offer my skills for projects", I: Briefcase, v: "Ideal for photography, design, music production, styling, video, writing and other project-based work." },
  { k: "bookings", t: "Bookings", d: "Let people book me for sessions, performances or events", I: CalendarCheck, v: "Useful for performers, musicians, photographers, dancers and other bookable creatives." },
] as const;
type Offer = (typeof OFFERS)[number]["k"];

const EARN_BY: Record<Offer, string | null> = { portfolio: null, sell: "Sell finished work", commission: "Get commissioned", services: "Get hired for creative projects", bookings: "Get booked" };
const CITIES = ["Lusaka", "Kitwe", "Ndola", "Livingstone", "Kabwe"];

type Work = { kind: "image" | "video" | "audio" | "project"; title: string; desc: string; img: string };
type Data = {
  cats: Cat[]; custom: string; subs: string[]; name: string;
  offers: Offer[]; work: Work | null; earn: string[];
  city: string; country: string; bio: string; portrait: string; portraitPos: number;
  email: string; password: string;
};
const EMPTY: Data = { cats: [], custom: "", subs: [], name: "", offers: ["portfolio"], work: null, earn: [], city: "", country: "Zambia", bio: "", portrait: "", portraitPos: 50, email: "", password: "" };
const KEY = "iaaa-onboarding-v2";

type StepId = "intro" | "create" | "refine" | "name" | "m1" | "discover" | "work" | "earn" | "m2" | "location" | "story" | "photo" | "preview" | "live";
const STAGES = ["Your creative identity", "Your work & opportunities", "Your presence"];

/* ---------------- small UI ---------------- */
function Card({ on, onClick, title, sub, I, children }: { on: boolean; onClick: () => void; title: string; sub?: string; I?: typeof Palette; children?: ReactNode }) {
  return (
    <motion.button type="button" role="checkbox" aria-checked={on} onClick={onClick} whileTap={{ scale: 0.98 }}
      className={`relative flex w-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors ${on ? "border-foreground bg-secondary shadow-[inset_0_0_0_1px_var(--color-foreground)]" : "border-border hover:border-foreground/40"}`}>
      {I && <I className="h-6 w-6" strokeWidth={1.5} />}
      <span>
        <span className="block text-[16px] font-medium tracking-[-0.01em]">{title}</span>
        {sub && <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{sub}</span>}
      </span>
      {children}
      <span className={`absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full border transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-foreground/25"}`}>{on && <Check className="h-3 w-3" />}</span>
    </motion.button>
  );
}
function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onClick}
      className={`rounded-full border px-5 py-3 text-[15px] font-medium transition-colors ${on ? "border-foreground bg-ink text-ink-foreground" : "border-border hover:border-foreground/40"}`}>
      {children}
    </button>
  );
}
const inputCls = "h-[60px] w-full border-0 border-b border-foreground/20 bg-transparent text-2xl tracking-[-0.02em] outline-none transition-colors placeholder:text-foreground/25 focus:border-foreground";

function usePicker(onChange: (v: string) => void) {
  const ref = useRef<HTMLInputElement>(null);
  const pick = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => { // downscale so the draft fits in browser storage
        const s = Math.min(1, 1400 / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        onChange(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };
  const input = <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />;
  return { open: () => ref.current?.click(), input };
}

/* ---------------- page ---------------- */
function JoinPage() {
  const [d, setD] = useState<Data>(EMPTY);
  const [step, setStep] = useState<StepId>("intro");
  const [hasDraft, setHasDraft] = useState<StepId | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState("");
  const [saveOpen, setSaveOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (s?.data) { setD({ ...EMPTY, ...s.data }); if (s.step && s.step !== "intro" && s.step !== "live") setHasDraft(s.step); } } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded || step === "intro") return;
    try { localStorage.setItem(KEY, JSON.stringify({ step, data: { ...d, password: "" } })); } catch {}
  }, [d, step, loaded]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => { setD((p) => ({ ...p, [k]: v })); setError(""); };
  const tog = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const cats = CATEGORIES.filter((c) => d.cats.includes(c.k));
  const refinable = cats.filter((c) => c.subs.length);
  const earnOpts = useMemo(() => [...d.offers.map((o) => EARN_BY[o]).filter(Boolean) as string[], "Grow my audience first", "I'm exploring"], [d.offers]);
  const commercial = d.offers.some((o) => o !== "portfolio");

  const flow: StepId[] = [
    "intro", "create", ...(refinable.length ? (["refine"] as StepId[]) : []), "name", "m1",
    "discover", "work", ...(commercial ? (["earn"] as StepId[]) : []), "m2",
    "location", "story", "photo", "preview", "live",
  ];
  const stageOf = (s: StepId) => (["create", "refine", "name", "m1"].includes(s) ? 0 : ["discover", "work", "earn", "m2"].includes(s) ? 1 : ["location", "story", "photo", "preview"].includes(s) ? 2 : -1);
  const stage = stageOf(step);
  const stageSteps = flow.filter((s) => stageOf(s) === stage && !s.startsWith("m") && s !== "preview");
  const sub = stageSteps.indexOf(step) + 1;
  const idx = flow.indexOf(step);

  // identity
  const subsLabel = d.subs.slice(0, 2);
  const primary = d.cats.includes("Other") && d.custom.trim() ? d.custom.trim() : cats.find((c) => c.k !== "Other")?.label ?? (d.custom.trim() || "Creative");
  const disciplines = [primary, ...subsLabel].filter((v, i, a) => a.indexOf(v) === i);
  const location = [d.city, d.country].filter(Boolean).join(", ");

  const validate = () => {
    if (step === "create" && !d.cats.length) return "Choose at least one — you can change this later.";
    if (step === "create" && d.cats.length === 1 && d.cats[0] === "Other" && !d.custom.trim()) return "Tell us what you create.";
    if (step === "name" && !d.name.trim()) return "Add the name people know you by.";
    if (step === "discover" && !d.offers.length) return "Choose at least one.";
    if (step === "location" && !d.city.trim()) return "Add the city you create from.";
    return "";
  };
  const goTo = (s: StepId, k = 1) => { setDir(k); setError(""); setStep(s); window.scrollTo({ top: 0 }); };
  const next = () => { const e = validate(); if (e) return setError(e); goTo(flow[Math.min(idx + 1, flow.length - 1)]!); };
  const back = () => goTo(flow[Math.max(0, idx - 1)]!, -1);

  const preview: Artist = {
    slug: "preview", name: d.name || "Your name", location: location || "Your city",
    disciplines, shortStatement: d.bio.split(/(?<=[.!?])\s/)[0] || "A few words about your work will appear here.", voiceNote: "in my own words",
    bio: [d.bio], portrait: d.portrait || placeholderArt, heroMedia: d.work?.img || d.portrait || placeholderArt,
    primaryCta: d.offers.includes("commission") ? "Commission me" : d.offers.includes("bookings") ? "Book me" : d.offers.includes("services") ? "Start a project" : d.offers.includes("sell") ? "View works" : "View portfolio",
    portfolio: [], services: d.offers.some((o) => o === "services" || o === "bookings" || o === "commission") ? [{ title: "", description: "", delivery: "", cta: "" }] : [],
    availability: { available: commercial, label: d.offers.includes("commission") ? "Available for commissions" : d.offers.includes("bookings") ? "Open to bookings" : commercial ? "Open to new work" : "Portfolio" },
    capabilities: { sellsWorks: d.offers.includes("sell"), acceptsCommissions: d.offers.includes("commission"), offersServices: d.offers.includes("services"), acceptsBookings: d.offers.includes("bookings") },
  };

  const variants = reduce ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : { enter: (k: number) => ({ opacity: 0, x: 32 * k }), center: { opacity: 1, x: 0 }, exit: (k: number) => ({ opacity: 0, x: -32 * k }) };

  const wide = step === "preview" || step === "live";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl">
        <div className="container-x flex h-[76px] items-center justify-between">
          <Link to="/" aria-label="I Am An Artist home"><Logo /></Link>
          {step !== "live" && step !== "intro" && <Link to="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground">Save &amp; exit</Link>}
        </div>
        {stage >= 0 && <StageBar stage={stage} sub={sub} total={stageSteps.length} milestone={step === "m1" || step === "m2" || step === "preview"} />}
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: EASE }}
            className={wide ? "" : `container-x mx-auto max-w-3xl pb-40 pt-10 md:pt-16 ${stage >= 0 ? "lg:grid lg:max-w-6xl lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20" : ""}`}>

            {stage >= 0 && !wide && <SideRail stage={stage} name={d.name} disciplines={disciplines} location={location} />}
            <div className="min-w-0 max-w-2xl">

            {step === "intro" && (
              <section className="grid min-h-[calc(100vh-76px)] items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="note -rotate-2">your work deserves a place of its own</p>
                  <h1 className="display-lg mt-4 max-w-xl">Let's create your space on I Am An Artist.</h1>
                  <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">Show your work, tell your story and open new ways for people to discover, collect, commission or work with you.</p>
                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    <SiteButton onClick={() => goTo("create")} className="px-10">Start <ArrowRight className="h-4 w-4" /></SiteButton>
                    {hasDraft && <button onClick={() => goTo(hasDraft)} className="link-line text-sm font-medium">Already started? Continue</button>}
                  </div>
                  <p className="mt-8 text-[13px] text-muted-foreground">Three short stages · about 5 minutes</p>
                </div>
                <motion.img initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: EASE }}
                  src={placeholderArt} alt="A creative at work in the studio" className="hidden aspect-[4/5] w-full rounded-sm object-cover lg:block" />
              </section>
            )}

            {step === "create" && (
              <Q title="What do you create?" sub="Choose everything that feels like you.">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {CATEGORIES.map((c) => <Card key={c.k} I={c.I} title={c.k} sub={c.d} on={d.cats.includes(c.k)} onClick={() => set("cats", tog(d.cats, c.k))} />)}
                </div>
                <AnimatePresence>
                  {d.cats.includes("Other") && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <label className="mt-8 block"><span className="text-[13px] font-medium">Your creative discipline</span>
                        <input autoFocus className={inputCls} value={d.custom} onChange={(e) => set("custom", e.target.value)} placeholder="e.g. Ceramicist" /></label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Q>
            )}

            {step === "refine" && (
              <Q title={refinable.length === 1 ? "What best describes what you do?" : "Tell us a little more."} sub="Pick as many as you like.">
                <div className="space-y-10">
                  {refinable.map((c) => (
                    <fieldset key={c.k}>
                      {refinable.length > 1 && <legend className="mb-4 flex items-center gap-2 text-[15px] font-medium"><c.I className="h-4 w-4" strokeWidth={1.5} />{c.k}</legend>}
                      <div className="flex flex-wrap gap-2">
                        {c.subs.map((s) => <Chip key={s} on={d.subs.includes(s)} onClick={() => set("subs", tog(d.subs, s))}>{s}</Chip>)}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </Q>
            )}

            {step === "name" && (
              <Q title="What should people know you as?">
                <label className="block"><span className="sr-only">Artist or creative name</span>
                  <input autoFocus className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Artist / creative name" onKeyDown={(e) => e.key === "Enter" && next()} /></label>
                <p className="mt-4 text-[14px] text-muted-foreground">This can be your real name, stage name, studio name or professional identity.</p>
              </Q>
            )}

            {step === "m1" && (
              <Milestone note="that's you" title="Your creative identity is taking shape.">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: EASE }} className="rounded-2xl border border-border p-8">
                  <p className="text-[22px] font-semibold uppercase tracking-[0.08em]">{d.name}</p>
                  <p className="mt-2 text-muted-foreground">{disciplines.join(" · ")}</p>
                </motion.div>
              </Milestone>
            )}

            {step === "discover" && (
              <Q title="What should people discover when they visit you?" sub="Choose everything that fits today. You can add more later.">
                <div className="grid gap-3 sm:grid-cols-2">
                  {OFFERS.map((o) => (
                    <Card key={o.k} I={o.I} title={o.t} sub={o.d} on={d.offers.includes(o.k)} onClick={() => set("offers", tog(d.offers, o.k))}>
                      <AnimatePresence>
                        {d.offers.includes(o.k) && (
                          <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="block overflow-hidden">
                            <span className="block pt-1 text-[13px] leading-snug text-foreground/80">{o.v}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </Q>
            )}

            {step === "work" && <WorkStep d={d} set={set} />}

            {step === "earn" && (
              <Q title="How would you most like I Am An Artist to help you earn?" sub="This helps us bring the right opportunities to you.">
                <div className="flex flex-wrap gap-2">
                  {earnOpts.map((o) => <Chip key={o} on={d.earn.includes(o)} onClick={() => set("earn", tog(d.earn, o))}>{o}</Chip>)}
                </div>
              </Q>
            )}

            {step === "m2" && (
              <Milestone note="now there's something to discover" title="Your work has a home.">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: EASE }} className="grid overflow-hidden rounded-2xl border border-border sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="aspect-[4/5] bg-secondary">
                    {d.work?.img ? <img src={d.work.img} alt={d.work.title || "Your first work"} className="h-full w-full object-cover" />
                      : <div className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">Your first work will appear here</div>}
                  </div>
                  <div className="flex flex-col justify-end p-7">
                    <p className="eyebrow text-muted-foreground">{disciplines.join(" · ")}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{d.name}</p>
                    {d.work?.title && <p className="note-title mt-3">{d.work.title}</p>}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {OFFERS.filter((o) => d.offers.includes(o.k)).map((o) => <span key={o.k} className="rounded-full border border-border px-3 py-1 text-[12px]">{o.t}</span>)}
                    </div>
                  </div>
                </motion.div>
              </Milestone>
            )}

            {step === "location" && (
              <Q title="Where do you create from?" sub="It helps people nearby find you — no street address needed.">
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => <Chip key={c} on={d.city === c} onClick={() => setD((p) => ({ ...p, city: c, country: "Zambia" }))}>{c}</Chip>)}
                  <Chip on={!!d.city && !CITIES.includes(d.city)} onClick={() => set("city", CITIES.includes(d.city) || !d.city ? " " : d.city)}>Other</Chip>
                </div>
                {d.city && !CITIES.includes(d.city) && (
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <label><span className="text-[13px] font-medium">City</span><input autoFocus className={inputCls} value={d.city.trimStart()} onChange={(e) => set("city", e.target.value || " ")} placeholder="Your city" /></label>
                    <label><span className="text-[13px] font-medium">Country</span><input className={inputCls} value={d.country} onChange={(e) => set("country", e.target.value)} /></label>
                  </div>
                )}
              </Q>
            )}

            {step === "story" && (
              <Q title="Tell people a little about you." sub="What do you create, what inspires you, and what would you like people to know about your work?">
                <textarea autoFocus maxLength={700} rows={6} value={d.bio} onChange={(e) => set("bio", e.target.value)}
                  placeholder="I create… I'm inspired by… I'd love people to know…"
                  className="w-full resize-none rounded-2xl border border-border bg-transparent p-5 text-lg leading-relaxed outline-none transition-colors placeholder:text-foreground/25 focus:border-foreground" />
                <p className="mt-2 text-right text-[12px] text-muted-foreground">{d.bio.length} / 700</p>
                {d.bio.trim() && (
                  <div className="mt-6 border-l-2 border-foreground/15 pl-5">
                    <p className="eyebrow text-muted-foreground">On your profile</p>
                    <p className="mt-2 text-xl leading-snug tracking-[-0.015em]">{preview.shortStatement}</p>
                  </div>
                )}
              </Q>
            )}

            {step === "photo" && <PhotoStep d={d} set={set} />}

            {(step === "preview" || step === "live") && (
              <section>
                <div className="container-x pt-12">
                  <p className="note -rotate-1">{step === "live" ? "welcome in" : "this is you"}</p>
                  <h1 className="display-lg mt-3 max-w-3xl">{step === "live" ? "Your creative space is live." : "This is how people will meet you."}</h1>
                </div>
                <div className="mt-8 border-y border-border"><HeroProfile a={preview} preview /></div>
                {d.work?.img && (
                  <div className="container-x py-14">
                    <p className="eyebrow text-muted-foreground">Portfolio</p>
                    <figure className="mt-5 max-w-md">
                      <img src={d.work.img} alt={d.work.title} className="aspect-[4/5] w-full object-cover" />
                      {d.work.title && <figcaption className="note-title mt-3">{d.work.title}</figcaption>}
                    </figure>
                  </div>
                )}
                <div className="container-x flex flex-wrap gap-3 pb-24 pt-6">
                  {step === "preview" ? (
                    <>
                      <SiteButton onClick={() => setSaveOpen(true)}>Publish my profile <ArrowRight className="h-4 w-4" /></SiteButton>
                      <SiteButton variant="outline" onClick={() => goTo("create", -1)}>Go back and edit</SiteButton>
                    </>
                  ) : (
                    <>
                      <SiteButton onClick={() => window.scrollTo({ top: 200, behavior: "smooth" })}>View my profile <ArrowRight className="h-4 w-4" /></SiteButton>
                      <SiteButton variant="outline" onClick={() => goTo("work", -1)}>Add another project</SiteButton>
                      {d.offers.includes("sell") && <SiteButton variant="outline" href="/shop">List something for sale</SiteButton>}
                      {d.offers.some((o) => o === "services" || o === "bookings" || o === "commission") && <SiteButton variant="outline" onClick={() => goTo("discover", -1)}>Add a service</SiteButton>}
                      <SiteButton variant="outline" onClick={() => navigator.clipboard?.writeText(location)}>Invite someone to view it</SiteButton>
                    </>
                  )}
                </div>
              </section>
            )}

            {error && <p role="alert" className="mt-6 text-sm text-destructive">{error}</p>}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {!["intro", "preview", "live"].includes(step) && (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container-x mx-auto flex max-w-3xl items-center justify-between gap-4 py-4 lg:max-w-6xl lg:pl-[380px]">
            <button onClick={back} className="inline-flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100"><ArrowLeft className="h-4 w-4" />Back</button>
            <div className="flex items-center gap-5">
              {step === "work" && <button onClick={() => { set("work", null); goTo(flow[idx + 1]!); }} className="link-line text-sm font-medium">I'll add this later</button>}
              {step === "photo" && !d.portrait && <button onClick={() => goTo("preview")} className="link-line text-sm font-medium">Skip for now</button>}
              <SiteButton onClick={next}>
                {step === "m2" ? "Build my presence" : step === "work" && d.work?.img ? "Looks good" : step === "photo" ? "See my profile" : "Continue"} <ArrowRight className="h-4 w-4" />
              </SiteButton>
            </div>
          </div>
        </footer>
      )}

      <AnimatePresence>
        {saveOpen && <SaveModal d={d} set={set} onClose={() => setSaveOpen(false)} onDone={() => { setSaveOpen(false); goTo("live"); }} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- pieces ---------------- */
function SideRail({ stage, name, disciplines, location }: { stage: number; name: string; disciplines: string[]; location: string }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-40 space-y-12">
        <ol className="space-y-6">
          {STAGES.map((s, i) => (
            <li key={s} className="flex items-start gap-4">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] ${i < stage ? "border-foreground bg-foreground text-background" : i === stage ? "border-foreground" : "border-border text-muted-foreground"}`}>
                {i < stage ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <div className="min-w-0 pt-1">
                <p className={`text-[15px] leading-snug ${i === stage ? "font-medium" : i < stage ? "text-muted-foreground line-through decoration-foreground/30" : "text-muted-foreground"}`}>{s}</p>
                {i === stage && <p className="mt-1 text-[12px] text-muted-foreground">In progress</p>}
              </div>
            </li>
          ))}
        </ol>
        {name.trim() && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="rounded-2xl border border-border p-6">
            <p className="note -rotate-2">that's you</p>
            <p className="mt-3 text-[17px] font-semibold uppercase tracking-[0.06em]">{name}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{disciplines.join(" · ")}</p>
            {location && <p className="mt-1 text-[13px] text-muted-foreground">{location}</p>}
          </motion.div>
        )}
      </div>
    </aside>
  );
}

function StageBar({ stage, sub, total, milestone }: { stage: number; sub: number; total: number; milestone: boolean }) {
  return (
    <div className="border-b border-border">
      <div className="container-x pb-4">
        <div className="grid grid-cols-3 gap-3">
          {STAGES.map((s, i) => {
            const fill = i < stage ? 1 : i > stage ? 0 : milestone ? 1 : Math.max(0.08, (sub - 1) / total + 0.5 / total);
            return (
              <div key={s}>
                <p className={`mb-2 flex items-center gap-1.5 truncate text-[12px] ${i === stage ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {i < stage || (i === stage && milestone) ? <Check className="h-3 w-3 shrink-0" /> : <span className="shrink-0">{i + 1}</span>}
                  <span className="truncate">{s}</span>
                  {i === stage && !milestone && sub > 0 && <span className="ml-auto hidden shrink-0 text-muted-foreground sm:inline">{sub} of {total}</span>}
                </p>
                <div className="h-[3px] overflow-hidden rounded-full bg-border">
                  <motion.div className="h-full rounded-full bg-foreground" initial={false} animate={{ width: `${fill * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Q({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section>
      <h1 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">{title}</h1>
      {sub && <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">{sub}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Milestone({ note, title, children }: { note: string; title: string; children: ReactNode }) {
  return (
    <section className="pt-6">
      <p className="note -rotate-2">{note}</p>
      <h1 className="display-lg mt-3 max-w-2xl">{title}</h1>
      <div className="mt-10 max-w-xl">{children}</div>
    </section>
  );
}

type SetFn = <K extends keyof Data>(k: K, v: Data[K]) => void;

function WorkStep({ d, set }: { d: Data; set: SetFn }) {
  const w = d.work;
  const { open, input } = usePicker((img) => set("work", { kind: "image", title: "", desc: "", ...w, img }));
  const kinds = [["image", "Image", ImageIcon], ["video", "Video", Video], ["audio", "Audio", AudioLines], ["project", "Project", FolderOpen]] as const;
  return (
    <Q title="Show us something you're proud of." sub="It doesn't have to be for sale. This is simply the beginning of your portfolio.">
      {input}
      <div className="grid grid-cols-4 gap-2">
        {kinds.map(([k, t, I]) => (
          <button key={k} type="button" aria-pressed={w?.kind === k} onClick={() => set("work", { title: "", desc: "", img: "", ...w, kind: k })}
            className={`flex flex-col items-center gap-2 rounded-2xl border py-5 text-sm font-medium transition-colors ${w?.kind === k ? "border-foreground bg-ink text-ink-foreground" : "border-border hover:border-foreground/40"}`}>
            <I className="h-5 w-5" strokeWidth={1.5} />{t}
          </button>
        ))}
      </div>
      <button type="button" onClick={open} className="group relative mt-6 block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary">
        {w?.img ? (
          <>
            <motion.img initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: EASE }} src={w.img} alt={w.title || "Your work"} className="h-full w-full object-cover" />
            <span className="absolute bottom-4 right-4 rounded-full bg-background/90 px-4 py-2 text-[13px] font-medium opacity-0 transition-opacity group-hover:opacity-100">Replace</span>
          </>
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-background"><ImageIcon className="h-5 w-5" strokeWidth={1.5} /></span>
            <span className="text-[15px] font-medium">{w?.kind === "audio" ? "Add cover art" : w?.kind === "video" ? "Add a still or poster" : "Add an image of your work"}</span>
            <span className="text-[13px] text-muted-foreground">It'll appear large on your profile</span>
          </span>
        )}
      </button>
      {w?.img && (
        <div className="mt-8 space-y-6">
          <label className="block"><span className="text-[13px] font-medium">Title</span><input className={inputCls} value={w.title} onChange={(e) => set("work", { ...w, title: e.target.value })} placeholder="Give it a name" /></label>
          <label className="block"><span className="text-[13px] font-medium">Short description <span className="text-muted-foreground">· optional</span></span>
            <input className={`${inputCls} text-lg`} value={w.desc} onChange={(e) => set("work", { ...w, desc: e.target.value })} placeholder="A line about it" /></label>
        </div>
      )}
    </Q>
  );
}

function PhotoStep({ d, set }: { d: Data; set: SetFn }) {
  const { open, input } = usePicker((v) => set("portrait", v));
  return (
    <Q title="Put a face to the work." sub="Choose an image that represents you — a portrait, studio photo or professional creative image.">
      {input}
      <div className="grid items-end gap-8 sm:grid-cols-[minmax(0,320px)_1fr]">
        <button type="button" onClick={open} className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary">
          {d.portrait ? <img src={d.portrait} alt="Your profile" style={{ objectPosition: `50% ${d.portraitPos}%` }} className="h-full w-full object-cover" />
            : <span className="absolute inset-0 flex flex-col items-center justify-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-full bg-background"><Camera className="h-5 w-5" strokeWidth={1.5} /></span><span className="text-[15px] font-medium">Upload a photo</span></span>}
        </button>
        <div className="space-y-5">
          {d.portrait ? (
            <>
              <SiteButton variant="outline" onClick={open}>Replace</SiteButton>
              <label className="block max-w-xs"><span className="text-[13px] font-medium">Reposition</span>
                <input type="range" min={0} max={100} value={d.portraitPos} onChange={(e) => set("portraitPos", +e.target.value)} className="mt-3 w-full accent-foreground" /></label>
            </>
          ) : <SiteButton onClick={open}>Upload</SiteButton>}
          <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{[d.city.trim(), d.country].filter(Boolean).join(", ")}</p>
        </div>
      </div>
    </Q>
  );
}

function SaveModal({ d, set, onClose, onDone }: { d: Data; set: SetFn; onClose: () => void; onDone: () => void }) {
  const [err, setErr] = useState("");
  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(d.email)) return setErr("Please enter a valid email address.");
    if (d.password.length < 8) return setErr("Password needs at least 8 characters.");
    onDone();
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-end bg-foreground/40 sm:place-items-center" onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-labelledby="save-title" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-t-3xl bg-background p-8 sm:rounded-3xl">
        <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        <p className="note -rotate-1">almost there</p>
        <h2 id="save-title" className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Save your profile</h2>
        <p className="mt-3 text-[15px] text-muted-foreground">Create your account so we can save and publish everything you've built.</p>
        <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <label className="block"><span className="text-[13px] font-medium">Email</span><input autoFocus type="email" autoComplete="email" className={`${inputCls} text-lg`} value={d.email} onChange={(e) => { set("email", e.target.value); setErr(""); }} /></label>
          <label className="block"><span className="text-[13px] font-medium">Password</span><input type="password" autoComplete="new-password" className={`${inputCls} text-lg`} value={d.password} onChange={(e) => { set("password", e.target.value); setErr(""); }} placeholder="At least 8 characters" /></label>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <SiteButton onClick={submit} className="w-full">Save &amp; publish <ArrowRight className="h-4 w-4" /></SiteButton>
        </form>
      </motion.div>
    </motion.div>
  );
}
