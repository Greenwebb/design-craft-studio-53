import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatPrice, works } from "@/data/works";
import { DELIVERY_LABELS, DELIVERY_PRICES, useBag } from "@/lib/bag";

export const Route = createFileRoute("/checkout/review")({
  head: () => ({ meta: [{ title: "Review — Checkout — I Am An Artist" }, { name: "robots", content: "noindex" }] }),
  component: ReviewStep,
});

const PAYMENT_LABELS = { card: "Card", "mobile-money": "Mobile Money", "bank-transfer": "Bank Transfer" } as const;

function ReviewStep() {
  const { items, draft, setDraft, placeOrder } = useBag();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const selected = items.map((s) => works.find((w) => w.slug === s)).filter((w) => w != null);
  const subtotal = selected.reduce((sum, w) => sum + w.price, 0);
  const delivery = draft.deliveryMethod ? DELIVERY_PRICES[draft.deliveryMethod] : 0;
  const total = subtotal + delivery;

  const complete = () => {
    if (!draft.agreed) {
      setError("Please agree to the purchase terms to continue.");
      return;
    }
    setError("");
    setProcessing(true);
    // Demo checkout: simulate payment processing, then confirm.
    window.setTimeout(() => {
      placeOrder(total);
      navigate({ to: "/order/confirmed" });
    }, 1600);
  };

  return (
    <div>
      <h1 className="text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]">
        Review your acquisition
      </h1>

      <div className="mt-12 max-w-lg space-y-10">
        <section aria-label="Works">
          <ul className="space-y-6">
            {selected.map((w) => (
              <li key={w.slug} className="flex gap-5">
                <img src={w.image} alt="" className="h-24 w-20 bg-secondary object-cover" />
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{w.title}</p>
                    <p className="text-sm text-muted-foreground">{w.artist.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{[w.medium, w.year].filter(Boolean).join(" · ")}</p>
                  </div>
                  <p className="text-[15px]">{formatPrice(w.price)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <dl className="space-y-4 border-t border-border pt-8 text-[15px]">
          <div className="flex justify-between gap-8">
            <dt className="text-muted-foreground">Contact</dt>
            <dd className="text-right">{draft.email}<br />{draft.phone}</dd>
          </div>
          <div className="flex justify-between gap-8">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="text-right">
              {draft.deliveryMethod ? DELIVERY_LABELS[draft.deliveryMethod] : "—"}
              {draft.address && <><br />{draft.address}{draft.city ? `, ${draft.city}` : ""}</>}
            </dd>
          </div>
          <div className="flex justify-between gap-8">
            <dt className="text-muted-foreground">Payment</dt>
            <dd className="text-right">{draft.paymentMethod ? PAYMENT_LABELS[draft.paymentMethod] : "—"}</dd>
          </div>
        </dl>

        <dl className="space-y-2 border-t border-border pt-6 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-[17px] font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Your purchase includes the work's authenticity documentation where applicable.
        </p>

        <label className="flex w-fit cursor-pointer items-start gap-3 text-[15px]">
          <input
            type="checkbox" checked={draft.agreed} onChange={(e) => setDraft({ agreed: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-ink"
          />
          <span>
            I agree to the{" "}
            <a href="/" className="link-line font-medium" onClick={(e) => e.preventDefault()}>
              purchase terms
            </a>
          </span>
        </label>

        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

        <button
          type="button"
          onClick={complete}
          disabled={processing}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing…
            </>
          ) : (
            <>
              Complete purchase — {formatPrice(total)} <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
