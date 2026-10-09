import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Play, Pause, Star } from "lucide-react";
import { HeroProfile as Hero } from "@/components/artist-hero";
import { EASE, Reveal, Cursor, TextLink, Nav, Footer, Grain, SiteButton } from "@/components/site";
import { getArtist, artistProfiles, type Artist, type PortfolioProject } from "@/data/artists";

export const Route = createFileRoute("/artists/$slug")({
  loader: ({ params }) => {
    const artist = getArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Artist not found — I Am An Artist" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.artist;
    const title = `${a.name} — ${a.disciplines.join(", ")} | I Am An Artist`;
    return {
      meta: [
        { title },
        { name: "description", content: a.shortStatement },
        { property: "og:title", content: title },
        { property: "og:description", content: a.shortStatement },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ArtistNotFound,
  component: ArtistPage,
});

function ArtistNotFound() {
  return (
    <div className="container-x grid min-h-screen place-items-center text-center">
      <div>
        <p className="note">this page wandered off</p>
        <h1 className="display-lg mt-4">Artist not found.</h1>
        <Link to="/" className="link-line mt-8 inline-block text-sm font-medium">Back to home</Link>
      </div>
    </div>
  );
}

type Section = { id: string; label: string };

function sectionsFor(a: Artist): Section[] {
  const s: Section[] = [{ id: "portfolio", label: "Portfolio" }];
  if (a.capabilities.sellsWorks && a.works?.length) s.push({ id: "works", label: "Works" });
  if (a.services?.length) s.push({ id: "services", label: a.capabilities.acceptsCommissions ? "Commissions" : "Services" });
  s.push({ id: "about", label: "About" });
  if (a.experience?.length) s.push({ id: "recognition", label: "Recognition" });
  if (a.reviews?.length) s.push({ id: "reviews", label: "Reviews" });
  return s;
}

function SubNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);
  return (
    <nav aria-label="Artist sections" className="sticky top-[57px] z-40 border-y border-border bg-background/90 backdrop-blur-xl">
      <div className="container-x flex gap-8 overflow-x-auto py-4 [scrollbar-width:none]">
        {sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className={`relative shrink-0 text-sm font-medium transition-opacity ${active === s.id ? "opacity-100" : "opacity-50 hover:opacity-80"}`}>
            <span className="eyebrow mr-2 text-muted-foreground">0{i + 1}</span>{s.label}
            {active === s.id && <motion.span layoutId="subnav" className="absolute -bottom-4 left-0 right-0 h-px bg-foreground" />}
          </a>
        ))}
      </div>
    </nav>
  );
}

function SectionHead({ n, label, title, note }: { n: number; label: string; title: string; note?: string }) {
  return (
    <div className="mb-14">
      <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">0{n}</span>{label}</p></Reveal>
      <Reveal delay={0.1}><h2 className="display-lg mt-6 max-w-3xl">{title}</h2></Reveal>
      {note && <Reveal delay={0.2}><p className="note mt-4 -rotate-1">{note}</p></Reveal>}
    </div>
  );
}

function MediaItem({ p, big }: { p: PortfolioProject; big?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const isMedia = p.kind !== "image";
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-sm" data-cursor={isMedia ? undefined : true}>
        <img src={p.img} alt={p.title} loading="lazy" className={`${big ? "aspect-[4/3]" : "aspect-[4/5]"} w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]`} />
        {isMedia && (
          <button onClick={() => setPlaying(!playing)} aria-label={`${playing ? "Pause" : "Play"} ${p.title}`}
            className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors hover:bg-ink/30">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-background text-foreground transition-transform group-hover:scale-110">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </span>
          </button>
        )}
        {p.kind === "audio" && (
          <div aria-hidden className="absolute inset-x-5 bottom-5 flex h-8 items-end gap-[3px]">
            {Array.from({ length: 48 }).map((_, i) => (
              <motion.span key={i} className="flex-1 rounded-full bg-background/90"
                animate={{ height: playing ? [`${20 + ((i * 37) % 80)}%`, `${10 + ((i * 53) % 90)}%`] : `${15 + ((i * 37) % 70)}%` }}
                transition={playing ? { duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: (i % 6) * 0.05 } : { duration: 0.3 }} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="note-title">{p.title}</h3>
          <p className="text-[13px] text-muted-foreground">{p.meta}</p>
        </div>
        <p className="shrink-0 text-[13px] text-muted-foreground">{p.duration ? `${p.duration} · ` : ""}{p.year}</p>
      </div>
    </div>
  );
}

function Portfolio({ a, n }: { a: Artist; n: number }) {
  const [first, ...rest] = a.portfolio;
  return (
    <section id="portfolio" className="container-x section-y scroll-mt-32">
      <SectionHead n={n} label="Featured portfolio" title="Selected projects." note="a few I'm proud of" />
      {first && <Reveal><MediaItem p={first} big /></Reveal>}
      <div className={`mt-16 grid gap-x-6 gap-y-16 ${rest.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {rest.map((p, i) => <Reveal key={p.title} delay={i * 0.08}><MediaItem p={p} /></Reveal>)}
      </div>
    </section>
  );
}

function Works({ a, n }: { a: Artist; n: number }) {
  return (
    <section id="works" className="scroll-mt-32 border-t border-border">
      <div className="container-x section-y">
        <SectionHead n={n} label="Works for sale" title="Available to collect." />
        <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {a.works!.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.08}>
              <a href="#works" data-cursor className="group block">
                <div className="relative overflow-hidden rounded-sm">
                  <img src={w.img} alt={`${w.title} by ${a.name}`} loading="lazy" className={`aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] ${w.sold ? "opacity-70" : ""}`} />
                  {w.sold && <span className="eyebrow absolute left-4 top-4 bg-background px-3 py-1.5">Sold</span>}
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <h3 className="note-title">{w.title}</h3>
                    <p className="text-[13px] text-muted-foreground">{w.medium} · {w.size}</p>
                  </div>
                  <p className={`text-sm font-medium ${w.sold ? "text-muted-foreground line-through" : ""}`}>{w.price}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ a, n }: { a: Artist; n: number }) {
  return (
    <section id="services" className="scroll-mt-32 bg-ink text-ink-foreground">
      <div className="container-x section-y">
        <div className="mb-14">
          <Reveal><p className="eyebrow opacity-60"><span className="mr-3 opacity-100">0{n}</span>{a.capabilities.acceptsCommissions ? "Commissions & services" : "Services"}</p></Reveal>
          <Reveal delay={0.1}><h2 className="display-lg mt-6 max-w-3xl">Work with {a.name.split(" ")[0]}.</h2></Reveal>
          <Reveal delay={0.2}><p className="note mt-4 -rotate-1">let's make something together</p></Reveal>
        </div>
        <ul className="border-t border-ink-foreground/15">
          {a.services!.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <li className="group grid gap-6 border-b border-ink-foreground/15 py-8 transition-colors md:grid-cols-[60px_1.2fr_1.4fr_auto] md:items-center md:gap-10 md:hover:bg-ink-foreground/[0.03]">
                <span className="eyebrow opacity-50">0{i + 1}</span>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{s.title}</h3>
                <div>
                  <p className="opacity-70">{s.description}</p>
                  <p className="mt-3 text-[13px] opacity-60">{s.delivery} · <span className="font-medium opacity-100">{s.price ?? "Custom pricing"}</span></p>
                </div>
                <SiteButton variant="outline-light" href="#services" className="px-6 py-3 group-hover:bg-ink-foreground group-hover:text-ink">
                  {s.cta} <ArrowUpRight className="h-4 w-4" />
                </SiteButton>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About({ a, n }: { a: Artist; n: number }) {
  return (
    <section id="about" className="container-x section-y scroll-mt-32 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
      <Reveal><img src={a.portrait} alt={`Portrait of ${a.name}`} loading="lazy" width={896} height={1120} className="aspect-[4/5] w-full rounded-sm object-cover" /></Reveal>
      <div className="flex flex-col justify-center">
        <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">0{n}</span>About</p></Reveal>
        <Reveal delay={0.1}><p className="note mt-8">in their own words</p></Reveal>
        <Reveal delay={0.15}><blockquote className="display-quote mt-3">“{a.shortStatement}”</blockquote></Reveal>
        <div className="mt-10 max-w-xl space-y-5 text-[17px] leading-relaxed text-muted-foreground">
          {a.bio.map((p, i) => <Reveal key={i} delay={0.2 + i * 0.05}><p>{p}</p></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Recognition({ a, n }: { a: Artist; n: number }) {
  return (
    <section id="recognition" className="scroll-mt-32 border-t border-border">
      <div className="container-x section-y">
        <SectionHead n={n} label="Recognition" title="Shows, projects & milestones." />
        <ul className="border-t border-border">
          {a.experience!.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.05}>
              <li className="grid gap-2 border-b border-border py-6 md:grid-cols-[120px_1fr_1fr] md:gap-10">
                <span className="text-sm text-muted-foreground">{e.year}</span>
                <span className="text-lg font-medium tracking-[-0.02em]">{e.title}</span>
                <span className="text-muted-foreground md:text-right">{e.place}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Reviews({ a, n }: { a: Artist; n: number }) {
  return (
    <section id="reviews" className="scroll-mt-32 border-t border-border">
      <div className="container-x section-y">
        <SectionHead n={n} label="Client words" title="What collaborators say." />
        <div className="grid gap-6 md:grid-cols-2">
          {a.reviews!.map((r, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-between gap-10 rounded-sm bg-card p-8 md:p-10">
                <div>
                  <div className="flex gap-1" aria-label="5 out of 5">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}</div>
                  <blockquote className="mt-6 text-xl leading-snug tracking-[-0.015em] md:text-2xl">“{r.quote}”</blockquote>
                </div>
                <figcaption className="text-sm"><span className="font-medium">{r.name}</span><span className="text-muted-foreground"> — {r.context}</span></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Related({ a }: { a: Artist }) {
  const others = artistProfiles.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <section className="border-t border-border">
      <div className="container-x section-y">
        <div className="mb-14 flex items-end justify-between gap-6">
          <Reveal><h2 className="display-lg max-w-2xl">More artists to discover.</h2></Reveal>
          <Reveal delay={0.1}><TextLink href="/" className="hidden md:inline-flex">All artists</TextLink></Reveal>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o, i) => (
            <Reveal key={o.slug} delay={i * 0.08}>
              <Link to="/artists/$slug" params={{ slug: o.slug }} data-cursor className="group block">
                <div className="overflow-hidden rounded-sm">
                  <img src={o.portrait} alt={`Portrait of ${o.name}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">{o.name}</h3>
                <p className="text-[13px] text-muted-foreground">{o.disciplines.join(" · ")} — {o.location}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileCta({ a }: { a: Artist }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <motion.div initial={false} animate={{ y: show ? 0 : 120 }} transition={{ duration: 0.4, ease: EASE }}
      className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-4 rounded-full border border-border bg-background/95 py-2 pl-5 pr-2 shadow-lg backdrop-blur-xl md:inset-x-auto md:right-6 md:bottom-6 md:pl-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{a.name}</p>
        <p className="truncate text-[12px] text-muted-foreground">{a.availability.label}</p>
      </div>
      <SiteButton href={a.services?.length ? "#services" : "#works"} className="shrink-0 px-5 py-3">{a.primaryCta}</SiteButton>
    </motion.div>
  );
}

function ArtistPage() {
  const { artist: a } = Route.useLoaderData();
  const sections = sectionsFor(a);
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  return (
    <div className="bg-background text-foreground">
      <Grain />
      <Cursor />
      <Nav />
      <main>
        <Hero a={a} />
        <SubNav sections={sections} />
        <Portfolio a={a} n={num("portfolio")} />
        {num("works") > 0 && <Works a={a} n={num("works")} />}
        {num("services") > 0 && <Services a={a} n={num("services")} />}
        <About a={a} n={num("about")} />
        {num("recognition") > 0 && <Recognition a={a} n={num("recognition")} />}
        {num("reviews") > 0 && <Reviews a={a} n={num("reviews")} />}
        <Related a={a} />
      </main>
      <Footer />
      <MobileCta a={a} />
    </div>
  );
}
