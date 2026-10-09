import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type DeliveryMethod = "collect" | "local" | "national" | "international" | "";
export type PaymentMethod = "card" | "mobile-money" | "bank-transfer" | "";

export type CheckoutDraft = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  updates: boolean;
  country: string;
  city: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  province: string;
  postal: string;
  paymentMethod: PaymentMethod;
  agreed: boolean;
};

export const emptyDraft: CheckoutDraft = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  updates: false,
  country: "Zambia",
  city: "",
  deliveryMethod: "",
  address: "",
  province: "",
  postal: "",
  paymentMethod: "",
  agreed: false,
};

export type LastOrder = {
  orderNo: string;
  items: string[];
  total: number;
  deliveryMethod: DeliveryMethod;
  email: string;
};

type BagContextValue = {
  items: string[];
  saved: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggleSave: (slug: string) => void;
  clear: () => void;
  draft: CheckoutDraft;
  setDraft: (patch: Partial<CheckoutDraft>) => void;
  resetDraft: () => void;
  lastOrder: LastOrder | null;
  placeOrder: (total: number) => void;
};

const BagContext = createContext<BagContextValue | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / unavailable */
  }
}

export function BagProvider({ children }: { children: ReactNode }) {
  // Start empty so SSR and the first client render match; restore from
  // localStorage after hydration to avoid hydration mismatches.
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [draft, setDraftState] = useState<CheckoutDraft>(emptyDraft);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    setItems(readJSON("iaaa-bag", []));
    setSaved(readJSON("iaaa-saved", []));
    setDraftState(readJSON("iaaa-checkout", emptyDraft));
    setLastOrder(readJSON("iaaa-last-order", null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON("iaaa-bag", items);
  }, [items, hydrated]);
  useEffect(() => writeJSON("iaaa-saved", saved), [saved]);
  useEffect(() => writeJSON("iaaa-checkout", draft), [draft]);
  useEffect(() => writeJSON("iaaa-last-order", lastOrder), [lastOrder]);

  const add = (slug: string) => setItems((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  const remove = (slug: string) => setItems((prev) => prev.filter((s) => s !== slug));
  const toggleSave = (slug: string) =>
    setSaved((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  const clear = () => setItems([]);
  const setDraft = (patch: Partial<CheckoutDraft>) => setDraftState((prev) => ({ ...prev, ...patch }));
  const resetDraft = () => setDraftState(emptyDraft);

  const placeOrder = (total: number) => {
    const orderNo = `IAA-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrder({ orderNo, items, total, deliveryMethod: draft.deliveryMethod, email: draft.email });
    setItems([]);
    setDraftState(emptyDraft);
  };

  return (
    <BagContext.Provider
      value={{ items, saved, add, remove, toggleSave, clear, draft, setDraft, resetDraft, lastOrder, placeOrder }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}

export const DELIVERY_PRICES: Record<Exclude<DeliveryMethod, "">, number> = {
  collect: 0,
  local: 250,
  national: 450,
  international: 1800,
};

export const DELIVERY_LABELS: Record<Exclude<DeliveryMethod, "">, string> = {
  collect: "Collection in person",
  local: "Local delivery",
  national: "National delivery",
  international: "International delivery",
};
