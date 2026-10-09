import heroArt from "@/assets/hero-art.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";
import work7 from "@/assets/work-7.jpg";
import work8 from "@/assets/work-8.jpg";

export type WorkType = "original" | "print" | "photography" | "sculpture" | "illustration" | "digital" | "mixed-media" | "other";

export type Work = {
  id: string;
  slug: string;
  title: string;
  artist: { id: string; name: string; slug: string };
  type: WorkType;
  medium?: string;
  year?: number;
  dimensions?: { width?: number; height?: number; depth?: number; unit: "cm" | "mm" | "in" };
  orientation?: "portrait" | "landscape" | "square";
  size: "small" | "medium" | "large" | "statement";
  price: number;
  currency: "ZMW";
  edition?: { current?: number; total?: number };
  availability: "available" | "reserved" | "sold";
  storyExcerpt?: string;
  image: string;
  location?: string;
  themes?: string[];
  curatorsPick?: boolean;
  ratio: number; // width / height
};

export const TYPE_LABELS: Record<WorkType, string> = {
  original: "Original Work",
  print: "Print / Edition",
  photography: "Photography",
  sculpture: "Sculpture",
  illustration: "Illustration",
  digital: "Digital Work",
  "mixed-media": "Mixed Media",
  other: "Other",
};

export const PRICE_RANGES = [
  { id: "under-1000", label: "Under K1,000", min: 0, max: 1000 },
  { id: "1000-5000", label: "K1,000 – K5,000", min: 1000, max: 5000 },
  { id: "5000-10000", label: "K5,000 – K10,000", min: 5000, max: 10000 },
  { id: "10000-25000", label: "K10,000 – K25,000", min: 10000, max: 25000 },
  { id: "25000-plus", label: "K25,000+", min: 25000, max: Infinity },
] as const;

export const SIZES = ["small", "medium", "large", "statement"] as const;
export const ORIENTATIONS = ["portrait", "landscape", "square"] as const;
export const THEMES = ["Memory", "Identity", "Home", "Nature", "Movement", "Portraits", "Contemporary Zambia", "Heritage", "Quiet Places", "New Voices"];

export const works: Work[] = [
  {
    id: "w1", slug: "after-the-rain", title: "After the Rain",
    artist: { id: "a1", name: "Mwansa Chileshe", slug: "mwansa-chileshe" },
    type: "original", medium: "Oil on canvas", year: 2026,
    dimensions: { width: 120, height: 150, unit: "cm" }, orientation: "portrait", size: "large",
    price: 18500, currency: "ZMW", availability: "available",
    storyExcerpt: "Painted during the first rains in Lusaka.",
    image: heroArt, location: "Lusaka", themes: ["Nature", "Quiet Places"], curatorsPick: true, ratio: 0.8,
  },
  {
    id: "w2", slug: "home-again", title: "Home Again",
    artist: { id: "a2", name: "Mwila Tembo", slug: "mwila-tembo" },
    type: "original", medium: "Acrylic on canvas", year: 2025,
    dimensions: { width: 90, height: 90, unit: "cm" }, orientation: "square", size: "medium",
    price: 9800, currency: "ZMW", availability: "available",
    image: work1, location: "Lusaka", themes: ["Home", "Memory"], ratio: 1,
  },
  {
    id: "w3", slug: "the-quiet-hour", title: "The Quiet Hour",
    artist: { id: "a3", name: "Natasha Banda", slug: "natasha-banda" },
    type: "photography", medium: "Archival pigment print", year: 2026,
    dimensions: { width: 60, height: 80, unit: "cm" }, orientation: "portrait", size: "medium",
    price: 4200, currency: "ZMW", edition: { current: 3, total: 20 }, availability: "available",
    storyExcerpt: "From a series on stillness in the city.",
    image: work6, location: "Lusaka", themes: ["Portraits", "Quiet Places"], ratio: 0.8,
  },
  {
    id: "w4", slug: "becoming", title: "Becoming",
    artist: { id: "a1", name: "Mwansa Chileshe", slug: "mwansa-chileshe" },
    type: "original", medium: "Oil and beeswax on canvas", year: 2025,
    dimensions: { width: 100, height: 125, unit: "cm" }, orientation: "portrait", size: "large",
    price: 15200, currency: "ZMW", availability: "reserved",
    image: work5, location: "Lusaka", themes: ["Identity", "Heritage"], ratio: 0.8,
  },
  {
    id: "w5", slug: "river-memory", title: "River Memory",
    artist: { id: "a2", name: "Mwila Tembo", slug: "mwila-tembo" },
    type: "original", medium: "Mixed media on board", year: 2024,
    dimensions: { width: 140, height: 100, unit: "cm" }, orientation: "landscape", size: "large",
    price: 12400, currency: "ZMW", availability: "available",
    image: work2, location: "Livingstone", themes: ["Memory", "Nature"], ratio: 1.4,
  },
  {
    id: "w6", slug: "standing-form", title: "Standing Form",
    artist: { id: "a4", name: "Chanda Mulenga", slug: "chanda-mulenga" },
    type: "sculpture", medium: "Carved mwanga wood", year: 2026,
    dimensions: { width: 22, height: 68, depth: 18, unit: "cm" }, orientation: "portrait", size: "medium",
    price: 21500, currency: "ZMW", availability: "available",
    storyExcerpt: "Carved from a single fallen tree near Kafue.",
    image: work7, location: "Lusaka", themes: ["Heritage", "Contemporary Zambia"], curatorsPick: true, ratio: 1.25,
  },
  {
    id: "w7", slug: "market-day", title: "Market Day",
    artist: { id: "a2", name: "Mwila Tembo", slug: "mwila-tembo" },
    type: "print", medium: "Giclée print on cotton rag", year: 2025,
    dimensions: { width: 50, height: 70, unit: "cm" }, orientation: "portrait", size: "small",
    price: 1450, currency: "ZMW", edition: { current: 12, total: 50 }, availability: "available",
    image: work3, location: "Lusaka", themes: ["Contemporary Zambia", "Movement"], ratio: 0.72,
  },
  {
    id: "w8", slug: "grandmother-s-light", title: "Grandmother's Light",
    artist: { id: "a3", name: "Natasha Banda", slug: "natasha-banda" },
    type: "photography", medium: "Silver gelatin print", year: 2024,
    dimensions: { width: 40, height: 50, unit: "cm" }, orientation: "portrait", size: "small",
    price: 3800, currency: "ZMW", edition: { current: 1, total: 10 }, availability: "sold",
    image: work6, location: "Kitwe", themes: ["Portraits", "Heritage"], ratio: 0.8,
  },
  {
    id: "w9", slug: "movement-study-i", title: "Movement Study I",
    artist: { id: "a1", name: "Mwansa Chileshe", slug: "mwansa-chileshe" },
    type: "original", medium: "Charcoal and ink on paper", year: 2026,
    dimensions: { width: 70, height: 100, unit: "cm" }, orientation: "portrait", size: "medium",
    price: 5600, currency: "ZMW", availability: "available",
    image: work8, location: "Lusaka", themes: ["Movement", "New Voices"], ratio: 0.7,
  },
  {
    id: "w10", slug: "red-earth", title: "Red Earth",
    artist: { id: "a2", name: "Mwila Tembo", slug: "mwila-tembo" },
    type: "original", medium: "Oil on linen", year: 2025,
    dimensions: { width: 180, height: 120, unit: "cm" }, orientation: "landscape", size: "statement",
    price: 32000, currency: "ZMW", availability: "available",
    storyExcerpt: "A statement piece on land and belonging.",
    image: work4, location: "Lusaka", themes: ["Nature", "Identity"], ratio: 1.5,
  },
  {
    id: "w11", slug: "small-hours", title: "Small Hours",
    artist: { id: "a3", name: "Natasha Banda", slug: "natasha-banda" },
    type: "photography", medium: "Archival pigment print", year: 2026,
    dimensions: { width: 30, height: 30, unit: "cm" }, orientation: "square", size: "small",
    price: 950, currency: "ZMW", edition: { current: 7, total: 30 }, availability: "available",
    image: work2, location: "Ndola", themes: ["Quiet Places", "New Voices"], ratio: 1,
  },
  {
    id: "w12", slug: "two-figures", title: "Two Figures",
    artist: { id: "a1", name: "Mwansa Chileshe", slug: "mwansa-chileshe" },
    type: "illustration", medium: "Ink on paper", year: 2025,
    dimensions: { width: 42, height: 59, unit: "cm" }, orientation: "portrait", size: "small",
    price: 2100, currency: "ZMW", availability: "available",
    image: work8, location: "Lusaka", themes: ["Portraits", "Identity"], ratio: 0.72,
  },
  {
    id: "w13", slug: "harvest-song", title: "Harvest Song",
    artist: { id: "a2", name: "Mwila Tembo", slug: "mwila-tembo" },
    type: "original", medium: "Acrylic on canvas", year: 2026,
    dimensions: { width: 110, height: 140, unit: "cm" }, orientation: "portrait", size: "large",
    price: 16800, currency: "ZMW", availability: "available",
    image: work1, location: "Lusaka", themes: ["Heritage", "Home"], ratio: 0.79,
  },
  {
    id: "w14", slug: "night-market-study", title: "Night Market Study",
    artist: { id: "a3", name: "Natasha Banda", slug: "natasha-banda" },
    type: "digital", medium: "Digital print on aluminium", year: 2026,
    dimensions: { width: 80, height: 60, unit: "cm" }, orientation: "landscape", size: "medium",
    price: 6400, currency: "ZMW", edition: { current: 2, total: 15 }, availability: "available",
    image: work4, location: "Lusaka", themes: ["Contemporary Zambia", "Movement"], ratio: 1.33,
  },
];

export const collections = [
  { id: "quiet-places", name: "Quiet Places", line: "Works about stillness, memory and spaces that stay with us.", note: "collected with intention" },
  { id: "new-voices", name: "New Voices", line: "Emerging artists worth watching." },
  { id: "contemporary-zambia", name: "Contemporary Zambia", line: "The country, right now." },
  { id: "under-5000", name: "Works Under K5,000", line: "A first piece, chosen well." },
  { id: "large-works", name: "Large Works", line: "For walls that ask for more." },
  { id: "limited-editions", name: "Limited Editions", line: "Few made. Fewer left." },
];

export const formatPrice = (n: number) => `K${n.toLocaleString("en-ZM")}`;
