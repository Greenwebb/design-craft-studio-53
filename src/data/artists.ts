import heroArt from "@/assets/hero-art.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import musician from "@/assets/artist-musician.jpg";
import photographer from "@/assets/artist-photographer.jpg";
import space from "@/assets/space.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";

export type MediaKind = "image" | "audio" | "video";
export type PortfolioProject = { title: string; kind: MediaKind; img: string; meta: string; year: string; duration?: string };
export type Work = { title: string; medium: string; size: string; price: string; img: string; sold?: boolean };
export type Service = { title: string; description: string; delivery: string; price?: string; cta: string };
export type Review = { quote: string; name: string; context: string };
export type ExperienceItem = { year: string; title: string; place: string };

export type Artist = {
  slug: string;
  name: string;
  location: string;
  disciplines: string[];
  shortStatement: string;
  voiceNote: string;
  bio: string[];
  portrait: string;
  heroMedia: string;
  primaryCta: string;
  portfolio: PortfolioProject[];
  works?: Work[];
  services?: Service[];
  reviews?: Review[];
  experience?: ExperienceItem[];
  availability: { available: boolean; label?: string };
  capabilities: { sellsWorks: boolean; acceptsCommissions: boolean; offersServices: boolean; acceptsBookings: boolean };
};

export const artistProfiles: Artist[] = [
  {
    slug: "mwansa-chileshe",
    name: "Mwansa Chileshe",
    location: "Lusaka, Zambia",
    disciplines: ["Painter", "Muralist"],
    shortStatement: "I paint the land the way it feels after rain — quiet, renewed, still becoming.",
    voiceNote: "colour first, then memory",
    bio: [
      "Mwansa grew up between Kabwe and Lusaka, sketching the long roads her family travelled each rainy season. Her large oil canvases hold that same sense of passage — open horizons, layered earth tones, and light that seems to arrive slowly.",
      "Today she works from a converted garage studio in Lusaka, painting originals for collectors and creating murals for hotels, offices and public spaces across Southern Africa.",
    ],
    portrait: artist1,
    heroMedia: heroArt,
    primaryCta: "Commission artist",
    portfolio: [
      { title: "After the Rain", kind: "image", img: heroArt, meta: "Oil on canvas", year: "2025" },
      { title: "Kafue Light", kind: "image", img: work1, meta: "Oil on linen", year: "2025" },
      { title: "Lodge Mural, Livingstone", kind: "image", img: space, meta: "Site-specific mural", year: "2024" },
      { title: "Red Earth Study", kind: "image", img: work4, meta: "Acrylic on paper", year: "2024" },
    ],
    works: [
      { title: "After the Rain", medium: "Oil on canvas", size: "120 × 150 cm", price: "ZMW 38,000", img: heroArt },
      { title: "Kafue Light", medium: "Oil on linen", size: "90 × 120 cm", price: "ZMW 24,500", img: work1 },
      { title: "Red Earth Study", medium: "Acrylic on paper", size: "50 × 70 cm", price: "ZMW 9,800", img: work4, sold: true },
    ],
    services: [
      { title: "Custom artwork", description: "An original painting made for your space, from first sketch to final varnish.", delivery: "6–8 weeks", price: "From ZMW 15,000", cta: "Commission artist" },
      { title: "Mural design", description: "Large-scale walls for hospitality, offices and public spaces.", delivery: "Scoped per site", cta: "Request quote" },
      { title: "Live painting", description: "A canvas painted in real time at your launch, gala or wedding.", delivery: "Half or full day", price: "From ZMW 8,000", cta: "Request booking" },
    ],
    experience: [
      { year: "2025", title: "Solo exhibition — Still Becoming", place: "Lusaka Contemporary Art Centre" },
      { year: "2024", title: "Commissioned mural", place: "Royal Livingstone area lodge" },
      { year: "2023", title: "Group show — New Southern Voices", place: "Johannesburg" },
    ],
    reviews: [
      { quote: "The painting changed the whole room. Mwansa listened carefully and delivered something better than we imagined.", name: "Thandiwe M.", context: "Private commission" },
      { quote: "Professional from first call to installation. Guests ask about the mural every week.", name: "Lodge manager", context: "Mural, Livingstone" },
    ],
    availability: { available: true, label: "Accepting commissions for early 2027" },
    capabilities: { sellsWorks: true, acceptsCommissions: true, offersServices: true, acceptsBookings: true },
  },
  {
    slug: "chanda-mulenga",
    name: "Chanda Mulenga",
    location: "Lusaka, Zambia",
    disciplines: ["Musician", "Producer", "Songwriter"],
    shortStatement: "I make songs that sound like Lusaka at dusk — warm, unhurried and a little bit nostalgic.",
    voiceNote: "every song starts as a hum",
    bio: [
      "Chanda is a guitarist, producer and songwriter blending Zambian kalindula rhythms with soul and modern R&B. He has written and produced for artists across the region and scored campaigns for local brands.",
      "From his home studio in Lusaka he works with singers, brands and filmmakers — remotely or in the room.",
    ],
    portrait: musician,
    heroMedia: musician,
    primaryCta: "Start a project",
    portfolio: [
      { title: "Dusk, Cairo Road", kind: "audio", img: work2, meta: "Single · Produced & written", year: "2025", duration: "3:42" },
      { title: "Mapalo", kind: "audio", img: work3, meta: "EP track · Guitar & vocals", year: "2024", duration: "4:05" },
      { title: "Zambezi Brewing — Campaign", kind: "video", img: space, meta: "Original score", year: "2024", duration: "0:45" },
    ],
    services: [
      { title: "Music production", description: "Full production from demo to mixed master, with live guitar and keys.", delivery: "2–4 weeks", price: "From ZMW 6,500 / track", cta: "Work with producer" },
      { title: "Songwriting", description: "Co-writing sessions or fully written songs for your voice.", delivery: "1–2 weeks", price: "From ZMW 4,000", cta: "Start a project" },
      { title: "Jingle & brand music", description: "Memorable audio for radio, TV and social campaigns.", delivery: "Scoped per brief", cta: "Request quote" },
      { title: "Live performance", description: "Solo acoustic or full band sets for events and venues.", delivery: "Per event", cta: "Book artist" },
    ],
    experience: [
      { year: "2025", title: "Producer — Dusk, Cairo Road", place: "Top 10, Zambian radio charts" },
      { year: "2024", title: "Featured performer", place: "Lusaka July Festival" },
    ],
    reviews: [
      { quote: "Chanda understood the feeling before I could explain it. The track is exactly who I am.", name: "Natasha K.", context: "Singer, production" },
    ],
    availability: { available: true, label: "Available for new projects" },
    capabilities: { sellsWorks: false, acceptsCommissions: false, offersServices: true, acceptsBookings: true },
  },
  {
    slug: "natasha-banda",
    name: "Natasha Banda",
    location: "Ndola, Zambia",
    disciplines: ["Photographer"],
    shortStatement: "I photograph people the way they look when no one is asking them to pose.",
    voiceNote: "patience is the real lens",
    bio: [
      "Natasha shoots on medium-format film and digital, focusing on portraiture, hospitality and brand stories. Her work is quiet, natural-light led and deeply human.",
      "Limited edition prints of her personal series are available, alongside commissioned shoots throughout Zambia.",
    ],
    portrait: photographer,
    heroMedia: photographer,
    primaryCta: "Book session",
    portfolio: [
      { title: "Copperbelt Mornings", kind: "image", img: artist2, meta: "Personal series", year: "2025" },
      { title: "Lodge Stories", kind: "image", img: space, meta: "Hospitality campaign", year: "2024" },
      { title: "Studio Portraits", kind: "image", img: artist1, meta: "Editorial", year: "2024" },
    ],
    works: [
      { title: "Copperbelt Morning I", medium: "Archival pigment print, ed. of 15", size: "60 × 75 cm", price: "ZMW 4,200", img: artist2 },
      { title: "Window, Ndola", medium: "Archival pigment print, ed. of 15", size: "50 × 60 cm", price: "ZMW 3,600", img: work2 },
    ],
    services: [
      { title: "Portrait session", description: "Two-hour natural light session, 20 edited images.", delivery: "1 week", price: "ZMW 3,500", cta: "Book session" },
      { title: "Hospitality photography", description: "Rooms, people and atmosphere for lodges and restaurants.", delivery: "Scoped per property", cta: "Request quote" },
    ],
    availability: { available: false, label: "Booked until December" },
    capabilities: { sellsWorks: true, acceptsCommissions: false, offersServices: true, acceptsBookings: true },
  },
  {
    slug: "mwila-tembo",
    name: "Mwila Tembo",
    location: "Lusaka, Zambia",
    disciplines: ["Painter"],
    shortStatement: "My work explores memory, movement and the ordinary spaces that shape our lives.",
    voiceNote: "the ordinary is enough",
    bio: [
      "Mwila paints interiors, markets and quiet streets from memory, using muted palettes and loose, confident brushwork.",
    ],
    portrait: artist2,
    heroMedia: work3,
    primaryCta: "View works",
    portfolio: [
      { title: "Market Light", kind: "image", img: work3, meta: "Oil on canvas", year: "2025" },
      { title: "Afternoon Room", kind: "image", img: work2, meta: "Oil on board", year: "2024" },
    ],
    works: [
      { title: "Market Light", medium: "Oil on canvas", size: "100 × 80 cm", price: "ZMW 18,000", img: work3 },
      { title: "Afternoon Room", medium: "Oil on board", size: "60 × 60 cm", price: "ZMW 11,500", img: work2 },
    ],
    availability: { available: true, label: "New works monthly" },
    capabilities: { sellsWorks: true, acceptsCommissions: false, offersServices: false, acceptsBookings: false },
  },
];

export const getArtist = (slug: string) => artistProfiles.find((a) => a.slug === slug);
