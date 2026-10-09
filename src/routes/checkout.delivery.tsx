import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { formatPrice, works } from "@/data/works";
import { DELIVERY_LABELS, DELIVERY_PRICES, useBag, type DeliveryMethod } from "@/lib/bag";

export const Route = createFileRoute("/checkout/delivery")({
  head: () => ({ meta: [{ title: "Delivery — Checkout — I Am An Artist" }, { name: "description", content: "Choose collection or delivery for your artwork." }, { property: "og:title", content: "Delivery — Checkout — I Am An Artist" }, { property: "og:description", content: "Choose collection or delivery for your artwork." }, { name: "robots", content: "noindex" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: DeliveryStep,
});

const inputCls =
  "h-[52px] w-full border-0 border-b border-foreground/20 bg-transparent text-[17px] outline-none transition-colors focus:border-foreground rounded-none";
const labelCls = "mb-1 block text-sm font-medium";

const COUNTRIES = ["Zambia", "South Africa", "United Kingdom", "United States", "Other"];

function DeliveryStep() {
  const { items, draft, setDraft } = useBag();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const selected = items.map((s) => works.find((w) => w.slug === s)).filter((w) => w != null);
  const hasSpecial = selected.some((w) => w.size === "statement" || (w.size === "large" && w.price >= 15000));
  const inZambia = draft.country === "Zambia";
  const isLusaka = inZambia && /lusaka/i.test(draft.city);

  const options: { id: Exclude<DeliveryMethod, "">; desc: string }[] = [
    ...(inZambia ? [{ id: "collect" as const, desc: "Collect in person in Lusaka. Details confirmed after purchase." }] : []),
    ...(isLusaka ? [{ id: "local" as const, desc: "Delivered to your address within Lusaka." }] : []),
    ...(inZambia ? [{ id: "national" as const, desc: "Delivered anywhere in Zambia." }] : []),
    ...(!inZambia ? [{ id: "international" as const, desc: "Fully coordinated international delivery." }] : []),
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.deliveryMethod) {
      setError("Choose how the work should reach you.");
      return;
    }
    if (draft.deliveryMethod !== "collect" && !draft.address.trim()) {
      setError("Enter the delivery address.");
      return;
    }
    setError("");
    navigate({ to: "/checkout/payment" });
  };

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]">
        How should the work reach you?
      </h1>

      <div className="mt-12 grid max-w-lg gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className={labelCls}>Country</label>
          <select
            id="country" value={draft.country}
            onChange={(e) => setDraft({ country: e.target.value, deliveryMethod: "" })}
            className={inputCls}
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="city" className={labelCls}>City / region</label>
          <input id="city" autoComplete="address-level2" value={draft.city} onChange={(e) => setDraft({ city: e.target.value })} className={inputCls} />
        </div>
      </div>

      <fieldset className="mt-12 max-w-lg">
        <legend className="sr-only">Delivery options</legend>
        <div className="divide-y divide-border border-y border-border">
          {options.map((o) => {
            const price = DELIVERY_PRICES[o.id];
            const selectedOpt = draft.deliveryMethod === o.id;
            return (
              <label key={o.id} className="flex cursor-pointer items-start gap-4 py-5">
                <span
                  aria-hidden
                  className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                    selectedOpt ? "border-ink" : "border-foreground/30"
                  }`}
                >
                  {selectedOpt && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                </span>
                <input
                  type="radio" name="delivery" value={o.id} checked={selectedOpt}
                  onChange={() => setDraft({ deliveryMethod: o.id })}
                  className="sr-only"
                />
                <span className="flex flex-1 items-start justify-between gap-4">
                  <span>
                    <span className="block text-[17px] font-medium">{DELIVERY_LABELS[o.id]}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{o.desc}</span>
                  </span>
                  <span className="text-[15px]">{price === 0 ? "Free" : formatPrice(price)}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {hasSpecial && (
        <div className="mt-8 max-w-lg border border-border p-6">
          <p className="text-[15px] font-medium">Special delivery</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            One or more works in your selection require coordinated delivery. We'll confirm final delivery
            arrangements with you after purchase — any difference in cost will be agreed with you first.
          </p>
        </div>
      )}

      {draft.deliveryMethod && draft.deliveryMethod !== "collect" && (
        <div className="mt-12 grid max-w-lg gap-8">
          <div>
            <label htmlFor="address" className={labelCls}>Address line</label>
            <input id="address" autoComplete="street-address" value={draft.address} onChange={(e) => setDraft({ address: e.target.value })} className={inputCls} />
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="province" className={labelCls}>Province / region</label>
              <input id="province" autoComplete="address-level1" value={draft.province} onChange={(e) => setDraft({ province: e.target.value })} className={inputCls} />
            </div>
            {!inZambia && (
              <div>
                <label htmlFor="postal" className={labelCls}>Postal code</label>
                <input id="postal" autoComplete="postal-code" value={draft.postal} onChange={(e) => setDraft({ postal: e.target.value })} className={inputCls} />
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p role="alert" className="mt-8 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        className="mt-12 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85"
      >
        Continue to payment <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
