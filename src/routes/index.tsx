import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ArrowLeft, Search, User, Menu, X } from "lucide-react";
import heroArt from "@/assets/hero-art.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import space from "@/assets/space.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "I Am An Artist — Original contemporary art from Zambia" },
      { name: "description", content: "Discover original works, the artists behind them, and the stories worth collecting." },
      { property: "og:title", content: "I Am An Artist — Original contemporary art from Zambia" },
      { property: "og:description", content: "Discover original works, the artists behind them, and the stories worth collecting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

import { SITE, EASE, Reveal, Cursor, TextLink, Nav, Footer, Grain } from "@/components/site";

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const lines = ["Every piece", "begins", "somewhere."];
  return (
    <section ref={ref} className="container-x grid min-h-[100svh] items-end gap-10 pb-12 pt-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:pb-16">
      <motion.div style={{ y: textY }} className="lg:pb-6">
        <h1 className="display-xl">
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.1 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
        >
          <p className="mt-8 max-w-sm text-base leading-relaxed text-muted-foreground">
            Discover original works, the artists behind them, and the stories worth collecting.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <a href={`${SITE}/shop`} className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85">
              Explore the collection
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <TextLink href={`${SITE}/artists`}>Meet the artists</TextLink>
          </div>
        </motion.div>
      </motion.div>
      <motion.figure style={{ y: imgY }} className="relative lg:justify-self-end lg:w-full lg:max-w-[760px]">
        <motion.div
          className="overflow-hidden rounded-sm"
          initial={{ opacity: 0, scale: 1.04, clipPath: "inset(10% 0 10% 0)" }}
          animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)" }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
        >
          <motion.img
            style={{ scale: imgScale }}
            src={heroArt}
            alt="After the Rain — oil painting of a Zambian landscape after the first rains"
            width={1024}
            height={1280}
            loading="eager"
            fetchPriority="high"
            className="aspect-[4/5] w-full object-cover lg:max-h-[78svh]"
          />
        </motion.div>
        <p className="note mt-4 -rotate-1">a story worth keeping</p>
        <figcaption className="mt-1 flex items-baseline justify-between gap-4 text-[13px]">
          <span><span className="font-medium">Mwansa Chileshe</span> — <em className="not-italic text-muted-foreground">After the Rain</em></span>
          <span className="text-muted-foreground">Lusaka, Zambia · 2026</span>
        </figcaption>
        <div aria-hidden className="pointer-events-none absolute -left-12 -top-12 hidden h-32 w-32 lg:block">
          <motion.svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <path id="stamp-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-foreground text-[8px] font-medium uppercase" style={{ letterSpacing: "0.24em" }}>
              <textPath href="#stamp-circle">Original works · Lusaka, Zambia · Est. 2026 ·</textPath>
            </text>
            <circle cx="50" cy="50" r="2.5" className="fill-current" />
          </motion.svg>
        </div>
      </motion.figure>
    </section>
  );
}

function Story() {
  return (
    <section className="container-x section-y grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <div>
        <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">01</span>The Story</p></Reveal>
        <Reveal delay={0.1}>
          <blockquote className="display-quote mt-8">
            “I painted this <span className="note-feature">after the first rains came.</span> Everything around me became quieter, greener and somehow new again.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 space-y-1 text-sm">
          <p className="note mb-1">From the studio</p>
          <p className="font-medium">Mwansa Chileshe</p>
          <p className="text-muted-foreground">Oil on canvas</p>
          <p className="text-muted-foreground">Lusaka, Zambia</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10"><TextLink href={`${SITE}/artists`}>Discover the story</TextLink></Reveal>
      </div>
      <Reveal delay={0.15}>
        <img src={artist1} alt="Mwansa Chileshe in her Lusaka studio" width={896} height={1120} loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" />
      </Reveal>
    </section>
  );
}

const works = [
  { img: work1, t: "Woman in Cobalt", a: "Chanda Mulenga", m: "Acrylic on canvas · 2025", p: "K24,000", span: "md:col-span-7", ar: "aspect-[4/5]", w: 896, h: 1120 },
  { img: work2, t: "Zambezi, Evening", a: "Natasha Banda", m: "Oil on linen · 2026", p: "K14,200", span: "md:col-span-5 md:mt-40", ar: "aspect-square", w: 1024, h: 1024 },
  { img: work3, t: "Copperbelt Strata", a: "Mwila Tembo", m: "Copper leaf, mixed media · 2026", p: "K42,000", span: "md:col-span-12", ar: "aspect-[16/9]", w: 1536, h: 896 },
  { img: work4, t: "Cairo Road, Saturday", a: "Bwalya Phiri", m: "Oil on canvas · 2025", p: "K19,800", span: "md:col-span-5", ar: "aspect-[4/5]", w: 896, h: 1120 },
  { img: heroArt, t: "After the Rain", a: "Mwansa Chileshe", m: "Oil on canvas · 2026", p: "K18,500", span: "md:col-span-7 md:mt-24", ar: "aspect-[4/5]", w: 1024, h: 1280 },
];

function Artwork({ w }: { w: (typeof works)[number] }) {
  return (
    <a href={`${SITE}/shop`} data-cursor className="group block">
      <div className="relative overflow-hidden rounded-sm">
        <img src={w.img} alt={`${w.t} by ${w.a}`} width={w.w} height={w.h} loading="lazy"
          className={`${w.ar} w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]`} />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 bg-background/90 px-3 py-1.5 text-xs font-medium opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
          View work <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-4">
        <div className="min-w-0">
          <h3 className="note-title">{w.t}</h3>
          <p className="text-sm">{w.a}</p>
          <p className="text-[13px] text-muted-foreground">{w.m}</p>
        </div>
        <p className="text-sm font-medium">{w.p}</p>
      </div>
    </a>
  );
}

function Works() {
  return (
    <section className="container-x section-y pt-0">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">02</span>Selected Works</p></Reveal>
          <Reveal delay={0.1}><h2 className="display-lg mt-6 max-w-3xl">Original works worth living with.</h2></Reveal>
        </div>
        <Reveal delay={0.2}><TextLink href={`${SITE}/shop`}>View all works</TextLink></Reveal>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-12">
        {works.map((w, i) => (
          <Reveal key={w.t} delay={(i % 2) * 0.1} className={w.span}><Artwork w={w} /></Reveal>
        ))}
      </div>
    </section>
  );
}

const artists = [
  { slug: "mwila-tembo", name: "Mwila Tembo", role: "Painter · Lusaka", quote: "My work explores memory, movement and the ordinary spaces that shape our lives.", img: artist2, works: [work3, work2] },
  { slug: "mwansa-chileshe", name: "Mwansa Chileshe", role: "Painter · Lusaka", quote: "I paint the land the way it feels after rain — quiet, renewed, still becoming.", img: artist1, works: [heroArt, work1] },
];

function Artists() {
  const [i, setI] = useState(0);
  const a = artists[i]!;
  const go = (d: number) => setI((i + d + artists.length) % artists.length);
  return (
    <section className="border-t border-border">
      <div className="container-x section-y">
        <div className="mb-16 flex items-end justify-between gap-6">
          <div>
            <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">03</span>Artists</p></Reveal>
            <Reveal delay={0.1}><h2 className="display-lg mt-6 max-w-3xl">Meet the people behind the work.</h2></Reveal>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => go(-1)} aria-label="Previous artist" className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-ink hover:text-ink-foreground"><ArrowLeft className="h-4 w-4" /></button>
            <button onClick={() => go(1)} aria-label="Next artist" className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-ink hover:text-ink-foreground"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={a.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: EASE }}
            className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <img src={a.img} alt={`Portrait of ${a.name}`} width={896} height={1120} loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" />
            <div className="flex flex-col justify-between gap-12">
              <div>
                <p className="eyebrow text-muted-foreground">{String(i + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}</p>
                <h3 className="mt-6 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{a.name}</h3>
                <p className="mt-2 text-muted-foreground">{a.role}</p>
                <p className="note mt-10">in their own words</p>
                <p className="mt-3 max-w-xl text-2xl leading-snug tracking-[-0.02em] md:text-3xl">“{a.quote}”</p>
                <div className="mt-10"><Link to="/artists/$slug" params={{ slug: a.slug }} className="group inline-flex items-center gap-2 text-[15px] font-medium"><span className="link-line pb-0.5">View artist</span><ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {a.works.map((w, k) => (
                  <div key={k} className="overflow-hidden rounded-sm">
                    <img src={w} alt={`Work by ${a.name}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.025]" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Spaces() {
  return (
    <section id="spaces" className="bg-ink text-ink-foreground">
      <div className="container-x section-y grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal><p className="eyebrow opacity-60"><span className="mr-3 opacity-100">04</span>Art for Spaces</p></Reveal>
          <Reveal delay={0.1}><h2 className="display-lg mt-6">Art changes a space.</h2></Reveal>
          <Reveal delay={0.15}><p className="note mt-4">curated for your space</p></Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed opacity-80">
              We help hotels, offices, restaurants and remarkable spaces discover and commission original work from Zambian artists.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed opacity-55">
              Tell us about your space. We’ll help curate works around its character, story and atmosphere.
            </p>
            <div className="mt-10"><TextLink href={`${SITE}/join`}>Curate my space</TextLink></div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <img src={space} alt="Large Zambian artwork installed in a hotel lobby" width={1536} height={1024} loading="lazy" className="aspect-[4/3] w-full rounded-sm object-cover lg:aspect-[3/2]" />
        </Reveal>
      </div>
    </section>
  );
}

const collections = [
  { t: "Memory", img: work1, n: "48 works", big: true },
  { t: "Quiet Places", img: work2, n: "32 works" },
  { t: "Contemporary Zambia", img: work4, n: "61 works" },
  { t: "Heritage", img: work3, n: "27 works", big: true },
];

function Collections() {
  return (
    <section className="container-x section-y">
      <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">05</span>Discover</p></Reveal>
      <Reveal delay={0.1}><h2 className="display-lg mt-6 mb-16 max-w-3xl">Find something that speaks to you.</h2></Reveal>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
        {collections.map((c, i) => (
          <Reveal key={c.t} delay={(i % 2) * 0.1}>
            <a href={`${SITE}/shop`} data-cursor className="group block">
              <div className="overflow-hidden rounded-sm">
                <img src={c.img} alt={`${c.t} collection`} loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] ${c.big ? "h-[420px] md:h-[600px]" : "h-[340px] md:h-[460px]"}`} />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{c.t}</h3>
                <span className="text-[13px] text-muted-foreground">{c.n}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-lg text-muted-foreground">
        {["Identity", "Home", "Movement", "Nature", "Portraits", "New Voices"].map((t) => (
          <a key={t} href={`${SITE}/shop`} className="link-line hover:text-foreground">{t}</a>
        ))}
      </Reveal>
    </section>
  );
}

function ForArtists() {
  return (
    <section className="border-t border-border">
      <div className="container-x section-y grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Reveal><p className="eyebrow text-muted-foreground"><span className="mr-3 text-foreground">06</span>For Artists</p></Reveal>
          <Reveal delay={0.1}><h2 className="display-xl mt-6">Your work deserves more than a post.</h2></Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
              Build your presence, tell the story behind your work and reach people who value what you create.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <a href={`${SITE}/join`} className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85">
                Join as an artist <ArrowUpRight className="h-4 w-4" />
              </a>
              <TextLink href={`${SITE}/join`}>Learn how it works</TextLink>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-4">
              <img src={artist2} alt="Mwila Tembo" loading="lazy" className="h-16 w-16 shrink-0 rounded-sm object-cover" />
              <div className="min-w-0">
                <p className="font-medium">Mwila Tembo</p>
                <p className="text-sm text-muted-foreground">Mixed media · Lusaka, Zambia</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Working with copper leaf and found textiles, Mwila maps the layered history of the Copperbelt — its labour, its land and its light.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[work3, work2, work4].map((w, k) => (
                <img key={k} src={w} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <p className="eyebrow text-muted-foreground">Story</p>
              <p className="mt-2 text-sm">“Every sheet of copper carries a town’s memory.”</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col justify-center border-t border-border py-24">
      <Reveal><p className="note mb-6">from Zambia, with a story</p></Reveal>
      <Reveal><h2 className="display-xl max-w-5xl">Made here. Collected everywhere.</h2></Reveal>
      <Reveal delay={0.15} className="mt-12"><TextLink href={`${SITE}/shop`} className="text-lg">Explore the collection</TextLink></Reveal>
    </section>
  );
}


function Index() {
  return (
    <div className="bg-background text-foreground">
      <Grain />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Works />
        <Artists />
        <Spaces />
        <Collections />
        <ForArtists />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
