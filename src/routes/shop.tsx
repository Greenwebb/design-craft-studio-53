import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { Cursor, EASE, Footer, Grain, Nav, Reveal, SiteButton, TextLink } from "@/components/site";
import { PRICE_RANGES, SIZES, ORIENTATIONS, THEMES, TYPE_LABELS, collections, formatPrice, works, type Work, type WorkType } from "@/data/works";

type Sort = "curated" | "newest" | "price-asc" | "price-desc";
type SearchState = {
  type?: WorkType | undefined;
  price?: string | undefined;
  size?: (typeof SIZES)[number] | undefined;
  orientation?: (typeof ORIENTATIONS)[number] | undefined;
  theme?: string | undefined;
  available?: boolean | undefined;
  sort?: Sort | undefined;
};

const SORTS: { id: Sort; label: string }[] = [
  { id: "curated", label: "Curated" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): SearchState => ({
    type: typeof s["type"] === "string" ? (s["type"] as WorkType) : undefined,
    price: typeof s["price"] === "string" ? (s["price"] as string) : undefined,
    size: typeof s["size"] === "string" ? (s["size"] as SearchState["size"]) : undefined,
    orientation: typeof s["orientation"] === "string" ? (s["orientation"] as SearchState["orientation"]) : undefined,
    theme: typeof s["theme"] === "string" ? (s["theme"] as string) : undefined,
    available: s["available"] === true || s["available"] === "true" ? true : undefined,
    sort: typeof s["sort"] === "string" ? (s["sort"] as Sort) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Original works worth keeping | I Am An Artist" },
      { name: "description", content: "Discover and acquire original artwork, prints, photography and sculpture by Zambian artists — curated like a gallery, not a store." },
      { property: "og:title", content: "Shop — Original works worth keeping | I Am An Artist" },
      { property: "og:description", content: "Discover and acquire original artwork, prints, photography and sculpture by Zambian artists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function applyFilters(list: Work[], f: SearchState): Work[] {
  let out = list;
  if (f.type) out = out.filter((w) => w.type === f.type);
  if (f.price) {
    const r = PRICE_RANGES.find((p) => p.id === f.price);
    if (r) out = out.filter((w) => w.price >= r.min && w.price < r.max);
  }
  if (f.size) out = out.filter((w) => w.size === f.size);
  if (f.orientation) out = out.filter((w) => w.orientation === f.orientation);
  if (f.theme) out = out.filter((w) => w.themes?.includes(f.theme!));
  if (f.available) out = out.filter((w) => w.availability === "available");
  const sorted = [...out];
  if (f.sort === "newest") sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  if (f.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (f.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

// Consistent product grid: every card identical in width, image ratio and info order.
// Marketplace scannability first — the editorial feel comes from typography and spacing.
function WorkCard({ w, eager }: { w: Work; eager?: boolean }) {
  return (
    <Reveal>
      <a href={`/artists/${w.artist.slug}`} data-cursor className="group block" aria-label={`${w.title} by ${w.artist.name}`}>
        <div className="overflow-hidden rounded-sm bg-secondary/40">
          <img
            src={w.image}
            alt={`${w.title} by ${w.artist.name}`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
          />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="note-title">{w.title}</h3>
            {w.curatorsPick && <span className="note shrink-0">curator's pick</span>}
          </div>
          <p className="mt-1 text-sm font-medium">{w.artist.name}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {[w.medium, w.year].filter(Boolean).join(" · ")}
            {w.edition?.total ? ` · Edition of ${w.edition.total}` : w.type === "original" ? " · 1 of 1" : ""}
          </p>
          <p className="mt-2 text-sm font-medium">
            {w.availability === "sold" ? (
              <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Sold</span>
            ) : w.availability === "reserved" ? (
              <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Reserved</span>
            ) : (
              formatPrice(w.price)
            )}
          </p>
        </div>
      </a>
    </Reveal>
  );
}

function FilterGroup({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-border py-5">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between">
        <span className="eyebrow">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
            <div className="flex flex-col gap-3 pt-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className="flex w-full items-center justify-between text-left text-[15px]">
      <span className={selected ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={`h-2.5 w-2.5 rounded-full border ${selected ? "border-ink bg-ink" : "border-foreground/30"}`} />
    </button>
  );
}

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const set = (patch: Record<string, unknown>) => navigate({ search: (prev: SearchState) => ({ ...prev, ...patch }) as SearchState, replace: true });
  const clear = () => navigate({ search: {}, replace: true });

  const filtered = useMemo(() => applyFilters(works, search), [search]);
  const shown = filtered.slice(0, visible);
  const activeCount = [search.type, search.price, search.size, search.orientation, search.theme, search.available].filter(Boolean).length;
  const sort = SORTS.find((s) => s.id === search.sort) ?? SORTS[0]!;

  useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener("open-search", open);
    return () => window.removeEventListener("open-search", open);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setFilterOpen(false); setSortOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  useEffect(() => {
    if (filterOpen) filterRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [filterOpen]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => { setVisible((v) => v + 6); setLoading(false); }, 500);
  };

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const w = works.filter((x) => [x.title, x.medium, ...(x.themes ?? [])].join(" ").toLowerCase().includes(q));
    const a = [...new Map(works.filter((x) => x.artist.name.toLowerCase().includes(q)).map((x) => [x.artist.slug, x.artist])).values()];
    const c = collections.filter((x) => x.name.toLowerCase().includes(q));
    return { w, a, c };
  }, [query]);

  const featured = works.filter((w) => w.curatorsPick);
  const featuredMain = featured[0] ?? works[0]!;
  const featuredSide = [works[2]!, works[8]!];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Cursor />
      <Grain />

      {/* Hero */}
      <section className="container-x pb-16 pt-36 md:pb-20 md:pt-40">
        <Reveal><p className="eyebrow text-muted-foreground">Shop</p></Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-5xl text-[clamp(48px,15vw,72px)] font-semibold leading-[0.92] tracking-[-0.06em] md:text-[clamp(64px,7vw,112px)] md:leading-[0.9]">
            Find something worth keeping.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[460px] text-[17px] leading-[1.55] text-muted-foreground">
              Original work, made by artists with something to say.
            </p>
            <p className="note">collected with intention</p>
          </div>
        </Reveal>
      </section>

      {/* Featured collection */}
      <section className="container-x pb-20 md:pb-28">
        <Reveal><p className="eyebrow text-muted-foreground">Curated this week</p></Reveal>
        <Reveal delay={0.08}>
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display-lg">Quiet Places</h2>
            <TextLink href="#browse">Explore collection</TextLink>
          </div>
        </Reveal>
        <Reveal delay={0.12}><p className="mt-4 max-w-md text-muted-foreground">Works about stillness, memory and spaces that stay with us.</p></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <a href="#browse" data-cursor className="group block">
              <div className="overflow-hidden rounded-sm">
                <img src={featuredMain.image} alt={`${featuredMain.title} by ${featuredMain.artist.name}`} fetchPriority="high" decoding="async" className="h-[320px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] md:h-[560px]" />
              </div>
              <p className="note-title mt-4">{featuredMain.title}</p>
              <p className="text-[13px] text-muted-foreground">{featuredMain.artist.name} · {formatPrice(featuredMain.price)}</p>
            </a>
          </Reveal>
          <div className="grid gap-6 md:col-span-4 md:grid-rows-2">
            {featuredSide.map((w) => (
              <Reveal key={w.id}>
                <a href="#browse" data-cursor className="group block">
                  <div className="overflow-hidden rounded-sm">
                    <img src={w.image} alt={`${w.title} by ${w.artist.name}`} loading="lazy" decoding="async" className="h-[220px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] md:h-[268px]" />
                  </div>
                  <p className="note-title mt-3">{w.title}</p>
                  <p className="text-[13px] text-muted-foreground">{w.artist.name} · {formatPrice(w.price)}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div id="browse" className="sticky top-[64px] z-20 border-y border-border bg-background/92 backdrop-blur-xl">
        <div className="container-x flex h-14 items-center justify-between gap-4 md:h-[60px]">
          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{filtered.length}</span> works</p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="opacity-80 transition-opacity hover:opacity-100"><Search className="h-[18px] w-[18px]" /></button>
            <button type="button" onClick={() => setFilterOpen(true)} className="inline-flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="h-4 w-4" />Filter{activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-ink-foreground">{activeCount}</span>}
            </button>
            <div className="relative">
              <button type="button" onClick={() => setSortOpen(!sortOpen)} aria-expanded={sortOpen} className="inline-flex items-center gap-1.5 text-sm font-medium">
                Sort: {sort.label} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.25, ease: EASE }}
                    className="absolute right-0 top-full mt-3 w-56 rounded-md border border-border bg-background p-2 shadow-lg">
                    {SORTS.map((s) => (
                      <button key={s.id} type="button" onClick={() => { set({ sort: s.id === "curated" ? undefined : s.id }); setSortOpen(false); }}
                        className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm ${s.id === sort.id ? "font-semibold" : "text-muted-foreground hover:bg-secondary"}`}>
                        {s.label}
                        {s.id === sort.id && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="container-x section-y">
        {shown.length === 0 ? (
          <div className="mx-auto max-w-md py-24 text-center">
            <p className="note-title">Nothing matches quite yet.</p>
            <p className="mt-4 text-muted-foreground">Try widening your filters or explore the full collection.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <SiteButton onClick={clear}>Clear filters</SiteButton>
              <SiteButton variant="outline" onClick={clear}>Explore all works</SiteButton>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:gap-y-20 lg:grid-cols-3">
            {shown.map((w, i) => (
              <WorkCard key={w.id} w={w} eager={i < 3} />
            ))}
            {loading && [0, 1, 2].map((i) => (
              <div key={`sk-${i}`} className="animate-pulse">
                <div className="aspect-[4/5] w-full rounded-sm bg-secondary" />
                <div className="mt-4 h-4 w-2/3 rounded-sm bg-secondary" />
                <div className="mt-2 h-3 w-1/3 rounded-sm bg-secondary" />
              </div>
            ))}
          </div>
        )}

        {/* B2B editorial interruption */}
        {shown.length >= 8 && (
          <Reveal className="my-24 border-y border-border py-16 text-center">
            <p className="note">looking for art for a space?</p>
            <p className="display-quote mx-auto mt-6 max-w-2xl">We can help curate work for hotels, offices and interiors.</p>
            <div className="mt-8 flex justify-center"><TextLink href="/#spaces">Curate my space</TextLink></div>
          </Reveal>
        )}

        {visible < filtered.length && (
          <div className="mt-20 flex justify-center">
            <SiteButton variant="outline" onClick={loadMore}>{loading ? "Loading…" : "Load more works"}</SiteButton>
          </div>
        )}
      </section>

      {/* Closing editorial — the story now that the work has been seen. */}
      <section className="container-x border-t border-border pb-24 pt-20 md:pb-32 md:pt-28">
        <Reveal><p className="eyebrow text-muted-foreground">Shop</p></Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-5xl text-[clamp(48px,15vw,72px)] font-semibold leading-[0.92] tracking-[-0.06em] md:text-[clamp(64px,7vw,112px)] md:leading-[0.9]">
            Find something worth keeping.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[460px] text-[17px] leading-[1.55] text-muted-foreground">
              Original work, made by artists with something to say.
            </p>
            <p className="note">collected with intention</p>
          </div>
        </Reveal>

        <div className="mt-20 md:mt-28">
          <Reveal><p className="eyebrow text-muted-foreground">Curated this week</p></Reveal>
          <Reveal delay={0.08}>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="display-lg">Quiet Places</h3>
              <TextLink href="#browse">Explore collection</TextLink>
            </div>
          </Reveal>
          <Reveal delay={0.12}><p className="mt-4 max-w-md text-muted-foreground">Works about stillness, memory and spaces that stay with us.</p></Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-8">
              <a href={`/artists/${featuredMain.artist.slug}`} data-cursor className="group block" aria-label={`${featuredMain.title} by ${featuredMain.artist.name}`}>
                <div className="overflow-hidden rounded-sm">
                  <img src={featuredMain.image} alt={`${featuredMain.title} by ${featuredMain.artist.name}`} loading="lazy" decoding="async" className="h-[320px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] md:h-[560px]" />
                </div>
                <p className="note-title mt-4">{featuredMain.title}</p>
                <p className="text-[13px] text-muted-foreground">{featuredMain.artist.name} · {formatPrice(featuredMain.price)}</p>
              </a>
            </Reveal>
            <div className="grid gap-6 md:col-span-4 md:grid-rows-2">
              {featuredSide.map((w) => (
                <Reveal key={w.id}>
                  <a href={`/artists/${w.artist.slug}`} data-cursor className="group block" aria-label={`${w.title} by ${w.artist.name}`}>
                    <div className="overflow-hidden rounded-sm">
                      <img src={w.image} alt={`${w.title} by ${w.artist.name}`} loading="lazy" decoding="async" className="h-[220px] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] md:h-[268px]" />
                    </div>
                    <p className="note-title mt-3">{w.title}</p>
                    <p className="text-[13px] text-muted-foreground">{w.artist.name} · {formatPrice(w.price)}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[65] bg-ink/30" onClick={() => setFilterOpen(false)} aria-hidden />
            <motion.div ref={filterRef} role="dialog" aria-modal="true" aria-label="Filter works"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.45, ease: EASE }}
              className="fixed inset-y-0 right-0 z-[66] flex w-full flex-col bg-background sm:w-[440px]">
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <p className="eyebrow">Filter</p>
                <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">
                <FilterGroup title="Type" defaultOpen>
                  {(Object.keys(TYPE_LABELS) as WorkType[]).map((t) => (
                    <Option key={t} label={TYPE_LABELS[t]} selected={search.type === t} onClick={() => set({ type: search.type === t ? undefined : t })} />
                  ))}
                </FilterGroup>
                <FilterGroup title="Price">
                  {PRICE_RANGES.map((r) => (
                    <Option key={r.id} label={r.label} selected={search.price === r.id} onClick={() => set({ price: search.price === r.id ? undefined : r.id })} />
                  ))}
                </FilterGroup>
                <FilterGroup title="Size">
                  {SIZES.map((s) => (
                    <Option key={s} label={s[0]!.toUpperCase() + s.slice(1)} selected={search.size === s} onClick={() => set({ size: search.size === s ? undefined : s })} />
                  ))}
                </FilterGroup>
                <FilterGroup title="Orientation">
                  {ORIENTATIONS.map((o) => (
                    <Option key={o} label={o[0]!.toUpperCase() + o.slice(1)} selected={search.orientation === o} onClick={() => set({ orientation: search.orientation === o ? undefined : o })} />
                  ))}
                </FilterGroup>
                <FilterGroup title="Story / Theme">
                  {THEMES.map((t) => (
                    <Option key={t} label={t} selected={search.theme === t} onClick={() => set({ theme: search.theme === t ? undefined : t })} />
                  ))}
                </FilterGroup>
                <FilterGroup title="Availability">
                  <Option label="Available only" selected={!!search.available} onClick={() => set({ available: search.available ? undefined : true } as Partial<SearchState>)} />
                </FilterGroup>
              </div>
              <div className="flex items-center gap-3 border-t border-border px-6 py-5">
                <SiteButton onClick={() => setFilterOpen(false)} className="flex-1">Show {filtered.length} works</SiteButton>
                <button type="button" onClick={clear} className="link-line text-sm font-medium">Clear filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[65] bg-background">
            <div className="container-x flex items-center justify-between py-6">
              <span className="text-[13px] font-semibold tracking-[0.14em]">I AM AN ARTIST</span>
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X className="h-6 w-6" /></button>
            </div>
            <div className="container-x mt-10 md:mt-20">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search artists, works or stories"
                aria-label="Search artists, works or stories"
                className="w-full border-b border-border bg-transparent pb-6 text-[clamp(36px,5vw,64px)] font-[450] tracking-[-0.03em] outline-none placeholder:text-muted-foreground/50"
              />
              {searchResults && (
                <div className="grid gap-12 py-12 md:grid-cols-3">
                  <div>
                    <p className="eyebrow text-muted-foreground">Works</p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {searchResults.w.slice(0, 5).map((w) => (
                        <li key={w.id}><a href={`/artists/${w.artist.slug}`} className="link-line text-lg">{w.title}</a></li>
                      ))}
                      {searchResults.w.length === 0 && <li className="text-muted-foreground">We couldn't find that yet.</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-muted-foreground">Artists</p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {searchResults.a.slice(0, 5).map((a) => (
                        <li key={a.slug}><a href={`/artists/${a.slug}`} className="link-line text-lg">{a.name}</a></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-muted-foreground">Collections</p>
                    <ul className="mt-5 flex flex-col gap-3">
                      {searchResults.c.map((c) => (
                        <li key={c.id}><a href="#browse" onClick={() => setSearchOpen(false)} className="link-line text-lg">{c.name}</a></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
