import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Check, Plus, ShieldCheck, Truck, FileCheck } from "lucide-react";
import { useState } from "react";
import { EASE, Footer, Nav, Reveal, SiteButton } from "@/components/site";
import { formatPrice, works, TYPE_LABELS, type Work } from "@/data/works";
import { useBag } from "@/lib/bag";

export const Route = createFileRoute("/_public/work/$slug")({
  head: ({ params }) => {
    const w = works.find((x) => x.slug === params.slug);
    const title = w ? `${w.title} by ${w.artist.name} — I Am An Artist` : "Artwork — I Am An Artist";
    const desc = w
      ? `${w.title} (${w.year ?? ""}) by ${w.artist.name}. ${w.medium ?? ""}. Original work from Zambia, available to acquire.`
      : "Original work from Zambian artists.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: WorkPage,
  notFoundComponent: WorkNotFound,
});

function dims(w: Work) {
  const d = w.dimensions;
  if (!d) return null;
  const parts = [d.width, d.height, d.depth].filter(Boolean);
  return `${parts.join(" × ")} ${d.unit}`;
}

function WorkNotFound() {
  return (
    <main className="bg-paper">

      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-32">
        <p className="font-hand text-2xl text-muted-foreground">this one has moved on</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.03em]">Work not found</h1>
        <SiteButton href="/shop" className="mt-10">
          Back to the shop <ArrowRight className="h-4 w-4" />
        </SiteButton>
      </div>

    </main>
  );
}

function WorkPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { items, add, saved, toggleSave } = useBag();
  const [zoomed, setZoomed] = useState(false);
  const work = works.find((x) => x.slug === slug);
  if (!work) return <WorkNotFound />;

  const inBag = items.includes(work.slug);
  const isSaved = saved.includes(work.slug);
  const available = work.availability === "available";
  const isOriginal = work.type === "original" || work.type === "sculpture";
  const moreFromArtist = works.filter((w) => w.artist.slug === work.artist.slug && w.slug !== work.slug).slice(0, 3);
  const related = works
    .filter((w) => w.slug !== work.slug && w.artist.slug !== work.artist.slug && w.themes?.some((t) => work.themes?.includes(t)))
    .slice(0, 3);

  const acquire = () => {
    add(work.slug);
    navigate({ to: "/bag" });
  };

  return (
    <main className="bg-paper">


      {/* ————— Above the fold ————— */}
      <section className="container-x grid gap-12 pb-24 pt-32 md:pt-40 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] lg:gap-[clamp(48px,6vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`View ${work.title} larger`}
            className="block w-full cursor-zoom-in overflow-hidden rounded-lg bg-secondary"
            data-cursor
          >
            <img
              src={work.image}
              alt={`${work.title} by ${work.artist.name}`}
              className="mx-auto max-h-[78svh] min-h-[40svh] w-auto max-w-full object-contain"
              style={{ aspectRatio: `${work.ratio}` }}
            />
          </button>
          <p className="mt-4 text-xs text-muted-foreground">Click to view larger</p>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="flex flex-col lg:pt-6"
        >
          <p className="font-hand text-2xl text-muted-foreground">
            {isOriginal ? "original work" : work.edition ? `edition ${work.edition.current} of ${work.edition.total}` : "available work"}
          </p>
          <h1 className="mt-3 text-[clamp(36px,4vw,56px)] font-semibold leading-[1.02] tracking-[-0.03em]">{work.title}</h1>
          <Link
            to="/artists/$slug"
            params={{ slug: work.artist.slug }}
            className="link-line mt-3 w-fit text-[17px] font-medium"
          >
            {work.artist.name}
          </Link>
          <div className="mt-5 space-y-1 text-[15px] text-muted-foreground">
            {work.medium && <p>{work.medium}</p>}
            {work.year && <p>{work.year}</p>}
            {dims(work) && <p>{dims(work)}</p>}
          </div>

          {work.storyExcerpt && (
            <p className="mt-8 max-w-md text-[17px] leading-relaxed">{work.storyExcerpt}</p>
          )}

          <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4" /> {isOriginal ? "Original · 1 of 1" : `${TYPE_LABELS[work.type]}${work.edition ? ` · Edition of ${work.edition.total}` : ""}`}
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Signed by the artist
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Certificate of authenticity
            </li>
          </ul>

          <p className="mt-8 text-[22px] font-medium">{formatPrice(work.price)}</p>

          {available ? (
            <div className="mt-6 flex flex-col gap-3">
              <SiteButton onClick={acquire} className="w-full" ariaLabel={`Acquire ${work.title}`}>
                {inBag ? "In your selection — view bag" : "Acquire this work"}
                <ArrowRight className="h-4 w-4" />
              </SiteButton>
              <SiteButton variant="outline" onClick={() => toggleSave(work.slug)} className="w-full" ariaLabel={`Save ${work.title}`}>
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </SiteButton>
              <a
                href={`mailto:hello@iamanartist.art?subject=Enquiry: ${encodeURIComponent(work.title)}`}
                className="link-line mx-auto mt-2 w-fit text-sm text-muted-foreground"
              >
                Enquire about this work
              </a>
            </div>
          ) : (
            <div className="mt-6">
              <p className="eyebrow">{work.availability === "sold" ? "Sold" : "Reserved"}</p>
              <p className="mt-3 text-[15px] text-muted-foreground">
                {work.availability === "sold"
                  ? "This work has found its home. Discover similar works below."
                  : "This work is currently reserved. Enquire to be first in line if it becomes available."}
              </p>
              <SiteButton variant="outline" href="/shop" className="mt-6">
                Discover similar work <ArrowRight className="h-4 w-4" />
              </SiteButton>
            </div>
          )}

          <div className="mt-10 space-y-2 border-t border-border pt-6 text-[13px] text-muted-foreground">
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure purchase</p>
            <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> Collection or delivery available</p>
            <p className="flex items-center gap-2"><FileCheck className="h-4 w-4" /> Authenticity documentation included</p>
          </div>
        </motion.aside>
      </section>

      {/* ————— The Story ————— */}
      {work.storyExcerpt && (
        <section className="bg-cream">
          <div className="container-x py-24 md:py-36">
            <Reveal>
              <p className="eyebrow">The Story</p>
              <p className="font-hand mt-3 text-2xl text-muted-foreground">in the artist's words</p>
              <blockquote className="mt-10 max-w-4xl text-[clamp(30px,4vw,60px)] font-medium leading-[1.06] tracking-[-0.035em]">
                “{work.storyExcerpt}”
              </blockquote>
              <p className="mt-8 text-sm text-muted-foreground">— {work.artist.name}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ————— Details ————— */}
      <section className="container-x grid gap-12 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="eyebrow">Details</p>
          <dl className="mt-8 divide-y divide-border">
            {[
              ["Title", work.title],
              ["Artist", work.artist.name],
              ["Type", TYPE_LABELS[work.type]],
              ["Medium", work.medium],
              ["Year", work.year?.toString()],
              ["Dimensions", dims(work)],
              ["Edition", work.edition ? `${work.edition.current ?? 1} of ${work.edition.total}` : isOriginal ? "1 of 1" : undefined],
              ["Location", work.location],
              ["Themes", work.themes?.join(", ")],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-8 py-4 text-[15px]">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Delivery & Ownership</p>
          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Collect in person in Lusaka at no cost, or have the work delivered — locally, nationally or
              internationally. Large and high-value works travel with coordinated, hands-on delivery.
            </p>
            <p>
              Every acquisition includes a certificate of authenticity and, where applicable, the artist's
              signature. Ownership transfers to you on completed purchase.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ————— The Artist ————— */}
      <section className="border-t border-border">
        <div className="container-x flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center">
          <Reveal>
            <p className="eyebrow">The Artist</p>
            <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.03em]">{work.artist.name}</h2>
            <p className="mt-2 text-muted-foreground">{work.location ?? "Lusaka"}, Zambia</p>
          </Reveal>
          <SiteButton variant="outline" href={`/artists/${work.artist.slug}`}>
            Meet the artist <ArrowRight className="h-4 w-4" />
          </SiteButton>
        </div>
      </section>

      {/* ————— More from this artist / Related ————— */}
      {[
        { title: "More from this artist", list: moreFromArtist },
        { title: "Related works", list: related },
      ].map(
        ({ title, list }) =>
          list.length > 0 && (
            <section key={title} className="border-t border-border">
              <div className="container-x py-20">
                <Reveal>
                  <p className="eyebrow">{title}</p>
                </Reveal>
                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((w, i) => (
                    <Reveal key={w.slug} delay={i * 0.08}>
                      <Link to="/work/$slug" params={{ slug: w.slug }} className="group block" data-cursor>
                        <div className="overflow-hidden rounded-lg bg-secondary">
                          <img
                            src={w.image}
                            alt={`${w.title} by ${w.artist.name}`}
                            loading="lazy"
                            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                        <p className="mt-4 font-medium">{w.title}</p>
                        <p className="text-sm text-muted-foreground">{w.artist.name}</p>
                        <p className="mt-1 text-sm">{w.availability === "available" ? formatPrice(w.price) : w.availability}</p>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )
      )}

      {/* ————— Zoom viewer ————— */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${work.title} — enlarged view`}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-6"
          onClick={() => setZoomed(false)}
          onKeyDown={(e) => e.key === "Escape" && setZoomed(false)}
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          <img
            src={work.image}
            alt={`${work.title} by ${work.artist.name} — enlarged`}
            className="max-h-[90svh] max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close enlarged view"
            className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-ink-foreground/30 text-ink-foreground transition-colors hover:bg-ink-foreground hover:text-ink"
          >
            <Plus className="h-5 w-5 rotate-45" />
          </button>
          <p className="absolute bottom-6 left-6 text-sm text-ink-foreground/70">
            {work.title} — {work.artist.name}
          </p>
        </div>
      )}

    </main>
  );
}
