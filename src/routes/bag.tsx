import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { Footer, Nav, Reveal, SiteButton } from "@/components/site";
import { formatPrice, works } from "@/data/works";
import { useBag } from "@/lib/bag";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your Selection — I Am An Artist" },
      { name: "description", content: "The works you have chosen to acquire from I Am An Artist." },
      { property: "og:title", content: "Your Selection — I Am An Artist" },
      { property: "og:description", content: "The works you have chosen to acquire from I Am An Artist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BagPage,
});

function BagPage() {
  const { items, remove } = useBag();
  const navigate = useNavigate();
  const selected = items.map((s) => works.find((w) => w.slug === s)).filter((w) => w != null);
  const total = selected.reduce((sum, w) => sum + w.price, 0);

  return (
    <main className="bg-paper">
      <Nav />
      <section className="container-x min-h-[70vh] pb-24 pt-32 md:pt-40">
        <Reveal>
          <p className="font-hand text-2xl text-muted-foreground">chosen with intention</p>
          <h1 className="mt-3 text-[clamp(40px,6vw,72px)] font-semibold tracking-[-0.035em]">Your selection</h1>
        </Reveal>

        {selected.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16 max-w-md">
              <p className="text-[17px] leading-relaxed text-muted-foreground">
                Nothing here yet. The right work has a way of finding you — take your time.
              </p>
              <SiteButton href="/shop" className="mt-8">
                Browse the shop <ArrowRight className="h-4 w-4" />
              </SiteButton>
            </div>
          </Reveal>
        ) : (
          <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px]">
            <ul className="divide-y divide-border">
              {selected.map((w, i) => (
                <li key={w.slug}>
                <Reveal delay={i * 0.06}>
                  <div className="flex gap-6 py-8 md:gap-10">
                    <Link to="/work/$slug" params={{ slug: w.slug }} className="shrink-0" data-cursor>
                      <img
                        src={w.image}
                        alt={`${w.title} by ${w.artist.name}`}
                        className="h-36 w-28 bg-secondary object-cover md:h-48 md:w-40"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link to="/work/$slug" params={{ slug: w.slug }} className="link-line text-xl font-medium">
                            {w.title}
                          </Link>
                          <p className="mt-1 text-[15px] text-muted-foreground">{w.artist.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(w.slug)}
                          aria-label={`Remove ${w.title} from your selection`}
                          className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {[w.medium, w.year].filter(Boolean).join(" · ")}
                      </p>
                      {w.dimensions && (
                        <p className="text-sm text-muted-foreground">
                          {[w.dimensions.width, w.dimensions.height, w.dimensions.depth].filter(Boolean).join(" × ")} {w.dimensions.unit}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        {w.edition ? `Edition ${w.edition.current ?? 1} of ${w.edition.total}` : "Original · 1 of 1"}
                      </p>
                      <p className="mt-auto pt-4 text-[17px] font-medium">{formatPrice(w.price)}</p>
                    </div>
                  </div>
                </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={0.15}>
              <aside className="h-fit border border-border p-8 lg:sticky lg:top-32">
                <p className="eyebrow">Summary</p>
                <dl className="mt-6 space-y-3 text-[15px]">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Artwork{selected.length > 1 ? "s" : ""}</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="text-muted-foreground">Calculated next</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-[17px] font-medium">
                    <dt>Total</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                </dl>
                <SiteButton onClick={() => navigate({ to: "/checkout/contact" })} className="mt-8 w-full">
                  Continue to checkout <ArrowRight className="h-4 w-4" />
                </SiteButton>
                <Link to="/shop" className="link-line mx-auto mt-5 flex w-fit text-sm text-muted-foreground">
                  Continue browsing
                </Link>
              </aside>
            </Reveal>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
