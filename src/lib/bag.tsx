import { useEffect, type ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  hydrated: boolean;
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

type BagState = Omit<BagContextValue, "hydrated"> & { hydrated: boolean };

// Global Zustand store. Persisted to localStorage, rehydrated after mount so
// SSR and the first client render match.
export const useBagStore = create<BagState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      items: [],
      saved: [],
      draft: emptyDraft,
      lastOrder: null,
      add: (slug) => set((s) => ({ items: s.items.includes(slug) ? s.items : [...s.items, slug] })),
      remove: (slug) => set((s) => ({ items: s.items.filter((x) => x !== slug) })),
      toggleSave: (slug) => set((s) => ({ saved: s.saved.includes(slug) ? s.saved.filter((x) => x !== slug) : [...s.saved, slug] })),
      clear: () => set({ items: [] }),
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: () => set({ draft: emptyDraft }),
      placeOrder: (total) => {
        const { items, draft } = get();
        const orderNo = `IAA-${Math.floor(1000 + Math.random() * 9000)}`;
        set({ lastOrder: { orderNo, items, total, deliveryMethod: draft.deliveryMethod, email: draft.email }, items: [], draft: emptyDraft });
      },
    }),
    {
      name: "iaaa-bag-store",
      skipHydration: true,
      partialize: (s) => ({ items: s.items, saved: s.saved, draft: s.draft, lastOrder: s.lastOrder }),
    },
  ),
);

/** Kept as a thin mount point: triggers rehydration once on the client. */
export function BagProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    Promise.resolve(useBagStore.persist.rehydrate()).then(() => useBagStore.setState({ hydrated: true }));
  }, []);
  return <>{children}</>;
}

export function useBag() {
  return useBagStore();
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
