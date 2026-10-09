import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, MapPin, Heart, Share2 } from "lucide-react";
import { EASE } from "@/components/site";
import type { Artist } from "@/data/artists";

export function HeroProfile({ a, preview }: { a: Artist; preview?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const [saved, setSaved] = useState(false);
  const secondary = a.capabilities.sellsWorks && a.works?.length ? { label: "View works", href: "#works" } : { label: "View portfolio", href: "#portfolio" };
  return (
    <section ref={ref} className={`container-x grid gap-12 pb-20 ${preview ? "pt-10" : "pt-32 md:pt-40"} lg:grid-cols-[1fr_1.05fr] lg:gap-20`}>
      <div className="flex flex-col justify-end">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="eyebrow text-muted-foreground">
          {a.disciplines.join(" · ")}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }} className="display-xl mt-6">
          {a.name}
        </motion.h1>
        <motion.p initial={{ opacity: 0, rotate: -2 }} animate={{ opacity: 1, rotate: -2 }} transition={{ duration: 0.8, delay: 0.5 }} className="note mt-4">
          {a.voiceNote}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}>
          <p className="mt-8 max-w-lg text-xl leading-snug tracking-[-0.015em] md:text-2xl">{a.shortStatement}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{a.location}</span>
            <span className="inline-flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${a.availability.available ? "bg-success" : "bg-muted-foreground"}`} />
              {a.availability.label ?? (a.availability.available ? "Available" : "Unavailable")}
            </span>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={a.services?.length ? "#services" : "#works"} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-transform hover:-translate-y-0.5">
              {a.primaryCta} <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={secondary.href} className="inline-flex items-center rounded-full border border-border px-7 py-4 text-sm font-medium transition-colors hover:bg-ink hover:text-ink-foreground">{secondary.label}</a>
            <button onClick={() => setSaved(!saved)} aria-pressed={saved} aria-label="Save artist" className="grid h-12 w-12 place-items-center rounded-full border border-border transition-colors hover:bg-secondary">
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
            <button onClick={() => navigator.share?.({ title: a.name, url: location.href }) ?? navigator.clipboard?.writeText(location.href)} aria-label="Share profile" className="grid h-12 w-12 place-items-center rounded-full border border-border transition-colors hover:bg-secondary">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: EASE }} className="relative overflow-hidden rounded-sm">
        <motion.img style={{ y }} src={a.heroMedia} alt={`${a.name} — featured work`} width={896} height={1120} className="aspect-[4/5] w-full scale-110 object-cover" />
        {a.heroMedia !== a.portrait && (
          <img src={a.portrait} alt={`Portrait of ${a.name}`} width={896} height={1120} className="absolute bottom-5 left-5 h-28 w-24 rounded-sm object-cover shadow-lg md:h-36 md:w-28" />
        )}
      </motion.div>
    </section>
  );
}

