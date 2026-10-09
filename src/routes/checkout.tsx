import { Logo } from "@/components/site";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { useEffect } from "react";
import { formatPrice, works } from "@/data/works";
import { DELIVERY_PRICES, useBag } from "@/lib/bag";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — I Am An Artist" },
      { property: "og:title", content: "Secure Checkout — I Am An Artist" },
      { property: "og:description", content: "Complete your acquisition securely with I Am An Artist." },
      { name: "description", content: "Complete your acquisition securely with I Am An Artist." },
      { name: "robots", content: "noindex" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutLayout,
});

const STEPS = [
  { id: "contact", label: "Contact", to: "/checkout/contact" },
  { id: "delivery", label: "Delivery", to: "/checkout/delivery" },
  { id: "payment", label: "Payment", to: "/checkout/payment" },
  { id: "review", label: "Review", to: "/checkout/review" },
] as const;

function CheckoutLayout() {
  const { hydrated, items, draft } = useBag();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const stepIndex = Math.max(0, STEPS.findIndex((s) => pathname.endsWith(s.id)));

  const selected = items.map((s) => works.find((w) => w.slug === s)).filter((w) => w != null);
  const subtotal = selected.reduce((sum, w) => sum + w.price, 0);
  const delivery = draft.deliveryMethod ? DELIVERY_PRICES[draft.deliveryMethod] : 0;

  useEffect(() => {
    if (hydrated && items.length === 0) navigate({ to: "/shop", replace: true });
  }, [hydrated, items.length, navigate]);

  if (!hydrated || selected.length === 0) return null;

  return (
    <main className="min-h-screen bg-paper">
      {/* Simplified checkout header */}
      <header className="border-b border-border">
        <div className="container-x flex items-center justify-between py-5">
          <Link to="/" aria-label="I Am An Artist home"><Logo /></Link>
          <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Secure checkout
          </p>
        </div>
      </header>

      {/* Progress */}
      <div className="container-x pt-10">
        <nav aria-label="Checkout progress" className="hidden items-center gap-3 text-sm md:flex">
          {STEPS.map((s, i) => (
            <span key={s.id} className="flex items-center gap-3">
              {i > 0 && <span className="text-muted-foreground/40">—</span>}
              <span
                aria-current={i === stepIndex ? "step" : undefined}
                className={`flex items-center gap-1.5 ${
                  i === stepIndex ? "font-medium" : i < stepIndex ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              >
                {i < stepIndex && <Check className="h-3.5 w-3.5" />}
                {s.label}
              </span>
            </span>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground md:hidden">
          {stepIndex + 1} of {STEPS.length} · {STEPS[stepIndex]!.label}
        </p>
      </div>

      <div className="container-x grid gap-16 pb-24 pt-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <Link to="/bag" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-opacity hover:opacity-70">
            <ArrowLeft className="h-4 w-4" /> Return to selection
          </Link>
          <Outlet />
        </div>

        {/* Sticky order summary */}
        <aside className="h-fit border-t border-border pt-8 lg:sticky lg:top-12 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="eyebrow">Your selection</p>
          <ul className="mt-6 space-y-6">
            {selected.map((w) => (
              <li key={w.slug} className="flex gap-4">
                <img src={w.image} alt="" className="h-20 w-16 bg-secondary object-cover" />
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-medium">{w.title}</p>
                    <p className="text-sm text-muted-foreground">{w.artist.name}</p>
                  </div>
                  <p className="text-[16px]">{formatPrice(w.price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-8 space-y-2 border-t border-border pt-6 text-[16px]">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{draft.deliveryMethod ? (delivery === 0 ? "Free" : formatPrice(delivery)) : "—"}</dd>
            </div>
            <div className="flex justify-between pt-2 text-[17px] font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal + delivery)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
