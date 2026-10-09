import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Footer, Nav, SiteButton } from "@/components/site";
import { works } from "@/data/works";
import { useBag } from "@/lib/bag";

export const Route = createFileRoute("/order/confirmed")({
  head: () => ({
    meta: [
      { title: "It's Yours — I Am An Artist" },
      { name: "description", content: "Your acquisition is confirmed. What happens next with your work." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmedPage,
});

const NEXT_STEPS = [
  "We confirm the work with the artist.",
  "Your work is prepared for collection or delivery.",
  "You receive delivery / collection updates.",
  "Authenticity documentation accompanies the work where applicable.",
];

function ConfirmedPage() {
  const { lastOrder } = useBag();
  const orderWorks = (lastOrder?.items ?? [])
    .map((s) => works.find((w) => w.slug === s))
    .filter((w) => w != null);
  const first = orderWorks[0];

  return (
    <main className="bg-paper">
      <Nav />
      <section className="container-x min-h-[80vh] pb-24 pt-32 md:pt-44">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <p className="font-hand text-3xl text-muted-foreground">it's yours</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(36px,5.4vw,72px)] font-semibold leading-[1.02] tracking-[-0.035em]">
            {first
              ? `${first.title}${orderWorks.length > 1 ? ` and ${orderWorks.length - 1} more` : ""} ${orderWorks.length > 1 ? "are" : "is"} now part of your story.`
              : "Your acquisition is confirmed."}
          </h1>
          {lastOrder && (
            <p className="mt-6 text-sm text-muted-foreground">
              Order {lastOrder.orderNo}
              {lastOrder.email && <> — confirmation sent to {lastOrder.email}</>}
            </p>
          )}
        </motion.div>

        {first && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="mt-16 grid items-start gap-12 md:grid-cols-2"
          >
            <div className="bg-secondary">
              <img
                src={first.image}
                alt={`${first.title} by ${first.artist.name}`}
                className="max-h-[60svh] w-full object-contain"
              />
            </div>
            <div>
              <p className="text-xl font-medium">{first.title}</p>
              <Link to="/artists/$slug" params={{ slug: first.artist.slug }} className="link-line mt-1 inline-block text-muted-foreground">
                {first.artist.name}
              </Link>

              <div className="mt-12">
                <p className="eyebrow">What happens next</p>
                <ol className="mt-6 space-y-5">
                  {NEXT_STEPS.map((s, i) => (
                    <li key={s} className="flex gap-4 text-[15px] leading-relaxed">
                      <span className="eyebrow mt-0.5 shrink-0 text-muted-foreground">0{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <SiteButton href="/shop">
                  Continue browsing <ArrowRight className="h-4 w-4" />
                </SiteButton>
                <SiteButton variant="outline" href={`/artists/${first.artist.slug}`}>
                  Meet the artist
                </SiteButton>
              </div>
            </div>
          </motion.div>
        )}

        {!first && (
          <div className="mt-16">
            <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground">
              Thank you for collecting with intention. If you arrived here directly, your confirmation email has
              the details.
            </p>
            <SiteButton href="/shop" className="mt-10">
              Back to the shop <ArrowRight className="h-4 w-4" />
            </SiteButton>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
