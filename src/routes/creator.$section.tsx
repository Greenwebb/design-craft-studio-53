import { createFileRoute, Link } from "@tanstack/react-router";
import { Image, ArrowUpRight } from "lucide-react";
import { ProjectSummary, MessageThread } from "@/components/ecosystem/primitives";
import { sharedProjects } from "@/data/ecosystem";
import { useStudio } from "@/components/creator/context";
import { StudioLink } from "@/components/creator/controls";
import { SiteButton } from "@/components/site";
const sections: Record<string, { title: string; description: string; action?: string }> = {
  portfolio: {
    title: "Portfolio",
    description: "A home for the projects that represent you.",
    action: "Add a portfolio project",
  },
  sell: {
    title: "Sell",
    description: "Have finished work ready for a new home?",
    action: "List a work",
  },
  services: {
    title: "Services",
    description: "Turn something you’re good at into something people can hire you for.",
    action: "Create a service",
  },
  projects: {
    title: "Projects",
    description: "Your commissions, enquiries and bookings, together.",
  },
  earnings: { title: "Earnings", description: "Your creative income, payments and payouts." },
  profile: {
    title: "My Profile",
    description: "Shape the creative identity the world gets to see.",
  },
  work: {
    title: "Your work",
    description: "Your portfolio, available work and creative services.",
  },
  messages: { title: "Messages", description: "Conversations around your work." },
  settings: { title: "Settings", description: "Your studio, your preferences." },
  availability: {
    title: "Availability",
    description: "Make room for commissions and bookings.",
    action: "Set availability",
  },
};
export const Route = createFileRoute("/creator/$section")({
  head: ({ params }) => {
    const title = sections[params.section]?.title ?? "Studio";
    const description =
      sections[params.section]?.description ?? "Your personal creative workspace.";
    return {
      meta: [
        { title: `${title} — I Am An Artist Studio` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — I Am An Artist Studio` },
        { property: "og:description", content: description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: StudioDestination,
});
function StudioDestination() {
  const { section } = Route.useParams();
  const { artist, capabilities, monetizationEnabled, state } = useStudio();
  const item = sections[section];
  const allowed = !(
    (section === "sell" && !capabilities.sellsWorks) ||
    (section === "services" && !capabilities.offersServices) ||
    (section === "earnings" && !monetizationEnabled)
  );
  if (section === "projects" && (capabilities.acceptsCommissions || capabilities.offersServices || capabilities.acceptsBookings)) return <section><h1 className="mb-4 text-4xl font-semibold">Projects</h1><p className="mb-8 text-xs text-muted-foreground">Shared project preview · Sample data</p>{sharedProjects.filter(p=>p.creatorId==="preview-artist").map(p=><ProjectSummary key={p.id} project={p} context="creator"/>)}</section>;
  if (section === "messages") return <section><h1 className="mb-8 text-4xl font-semibold">Messages</h1><MessageThread/></section>;
  return (
    <section className="min-h-[65vh]">
      <span className="note text-studio-green">room for what’s next</span>
      <h1 className="mt-4 text-4xl font-medium">{allowed && item ? item.title : "Your studio"}</h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        {allowed && item
          ? item.description
          : "This part of the studio isn’t enabled for your artist profile."}
      </p>
      {section === "work" && (
        <nav aria-label="Your work sections" className="my-8 flex flex-wrap gap-6">
          <StudioLink section="portfolio">Portfolio</StudioLink>
          {capabilities.sellsWorks && <StudioLink section="sell">Works for sale</StudioLink>}
          {capabilities.offersServices && <StudioLink section="services">Services</StudioLink>}
        </nav>
      )}
      <div className="relative mt-12 overflow-hidden border-y border-border py-12">
        <div
          aria-hidden
          className="studio-pattern absolute inset-y-0 right-0 w-24 opacity-[0.05]"
        />
        <Image size={28} strokeWidth={1} className="mb-6 text-studio-green" />
        <h2 className="text-2xl font-medium">
          {allowed && item ? "Your next chapter, coming soon." : "A creative space that fits you."}
        </h2>
        <p className="my-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {allowed && item
            ? "This workspace is reserved for the next iteration. Creating, editing and managing here aren’t available yet."
            : "Return Home to explore your profile, work and discovery."}
        </p>
        {section === "profile" ? (
          <Link
            to="/artists/$slug"
            params={{ slug: artist.slug }}
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            View public profile
            <ArrowUpRight size={16} />
          </Link>
        ) : (
          <Link
            to="/creator"
            search={{ artist: state }}
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            Back to Home
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );
}
