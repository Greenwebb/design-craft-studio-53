import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Smartphone, CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import { useBag, type PaymentMethod } from "@/lib/bag";

export const Route = createFileRoute("/checkout/payment")({
  head: () => ({ meta: [{ title: "Payment — Checkout — I Am An Artist" }, { name: "description", content: "Select a payment method for your artwork." }, { property: "og:title", content: "Payment — Checkout — I Am An Artist" }, { property: "og:description", content: "Select a payment method for your artwork." }, { name: "robots", content: "noindex" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PaymentStep,
});

const inputCls =
  "h-[52px] w-full border-0 border-b border-foreground/20 bg-transparent text-[17px] outline-none transition-colors focus:border-foreground rounded-none";
const labelCls = "mb-1 block text-sm font-medium";

const METHODS: { id: Exclude<PaymentMethod, "">; label: string; icon: typeof CreditCard; desc: string }[] = [
  { id: "card", label: "Card", icon: CreditCard, desc: "Visa or Mastercard, charged securely." },
  { id: "mobile-money", label: "Mobile Money", icon: Smartphone, desc: "MTN or Airtel Money — approve on your phone." },
  { id: "bank-transfer", label: "Bank Transfer", icon: Landmark, desc: "We reserve the work and send transfer details." },
];

function PaymentStep() {
  const { draft, setDraft } = useBag();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.paymentMethod) {
      setError("Choose a payment method.");
      return;
    }
    if (draft.paymentMethod === "card" && (card.number.replace(/\s/g, "").length < 12 || !card.expiry || card.cvc.length < 3)) {
      setError("Enter your card details to continue.");
      return;
    }
    setError("");
    navigate({ to: "/checkout/review" });
  };

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]">
        Complete your acquisition.
      </h1>

      <fieldset className="mt-12 max-w-lg">
        <legend className="sr-only">Payment method</legend>
        <div className="divide-y divide-border border-y border-border">
          {METHODS.map((m) => {
            const selectedM = draft.paymentMethod === m.id;
            return (
              <div key={m.id}>
                <label className="flex cursor-pointer items-start gap-4 py-5">
                  <span
                    aria-hidden
                    className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                      selectedM ? "border-ink" : "border-foreground/30"
                    }`}
                  >
                    {selectedM && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
                  </span>
                  <input
                    type="radio" name="payment" value={m.id} checked={selectedM}
                    onChange={() => setDraft({ paymentMethod: m.id })}
                    className="sr-only"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[17px] font-medium">
                      <m.icon className="h-4 w-4" /> {m.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{m.desc}</span>
                  </span>
                </label>

                {selectedM && m.id === "card" && (
                  <div className="grid gap-6 pb-6 pl-9">
                    <div>
                      <label htmlFor="cardNumber" className={labelCls}>Card number</label>
                      <input
                        id="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456"
                        value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="expiry" className={labelCls}>Expiry</label>
                        <input
                          id="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY"
                          value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className={labelCls}>CVC</label>
                        <input
                          id="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123"
                          value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <p className="text-[13px] text-muted-foreground">
                      Demo checkout — no real payment is processed yet.
                    </p>
                  </div>
                )}

                {selectedM && m.id === "mobile-money" && (
                  <p className="pb-6 pl-9 text-sm leading-relaxed text-muted-foreground">
                    After you confirm, we'll send a payment prompt to {draft.phone || "your phone"}. Your work is
                    reserved while the prompt is open.
                  </p>
                )}

                {selectedM && m.id === "bank-transfer" && (
                  <p className="pb-6 pl-9 text-sm leading-relaxed text-muted-foreground">
                    We'll email transfer details to {draft.email || "you"} and hold the work for 48 hours while
                    the transfer completes.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      {error && <p role="alert" className="mt-8 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        className="mt-12 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85"
      >
        Review your acquisition <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
