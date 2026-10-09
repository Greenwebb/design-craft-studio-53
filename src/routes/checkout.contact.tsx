import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useBag } from "@/lib/bag";

export const Route = createFileRoute("/checkout/contact")({
  head: () => ({ meta: [{ title: "Contact — Checkout — I Am An Artist" }, { name: "description", content: "Contact details for your artwork acquisition." }, { property: "og:title", content: "Contact — Checkout — I Am An Artist" }, { property: "og:description", content: "Contact details for your artwork acquisition." }, { name: "robots", content: "noindex" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ContactStep,
});

const inputCls =
  "h-[52px] w-full border-0 border-b border-foreground/20 bg-transparent text-[17px] outline-none transition-colors focus:border-foreground rounded-none";
const labelCls = "mb-1 block text-sm font-medium";

function ContactStep() {
  const { draft, setDraft } = useBag();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) errs.email = "Enter a valid email address.";
    if (draft.phone.trim().length < 7) errs.phone = "Enter a phone number we can reach you on.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) navigate({ to: "/checkout/delivery" });
  };

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em]">
        Where should we send your purchase details?
      </h1>

      <div className="mt-12 grid max-w-lg gap-8">
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input
            id="email" type="email" autoComplete="email" required
            value={draft.email} onChange={(e) => setDraft({ email: e.target.value })}
            className={inputCls} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" role="alert" className="mt-2 text-sm text-red-700">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input
            id="phone" type="tel" autoComplete="tel" required
            value={draft.phone} onChange={(e) => setDraft({ phone: e.target.value })}
            className={inputCls} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && <p id="phone-error" role="alert" className="mt-2 text-sm text-red-700">{errors.phone}</p>}
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelCls}>First name <span className="text-muted-foreground">(optional)</span></label>
            <input id="firstName" autoComplete="given-name" value={draft.firstName} onChange={(e) => setDraft({ firstName: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelCls}>Last name <span className="text-muted-foreground">(optional)</span></label>
            <input id="lastName" autoComplete="family-name" value={draft.lastName} onChange={(e) => setDraft({ lastName: e.target.value })} className={inputCls} />
          </div>
        </div>
        <label className="flex w-fit cursor-pointer items-center gap-3 text-[15px]">
          <input
            type="checkbox" checked={draft.updates} onChange={(e) => setDraft({ updates: e.target.checked })}
            className="h-4 w-4 accent-ink"
          />
          Keep me updated about this artist and new work
        </label>
      </div>

      <button
        type="submit"
        className="mt-12 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85"
      >
        Continue to delivery <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
