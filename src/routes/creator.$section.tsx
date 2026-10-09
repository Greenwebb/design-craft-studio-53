import type React from "react";
import { PortfolioModule, SellModule, ServicesModule } from "@/components/dashboard/work-manager";
import { EarningsModule } from "@/components/dashboard/wallet";
import { ProjectsModule } from "@/components/dashboard/projects";
import { ProfileModule, MessagesModule, AvailabilityModule } from "@/components/dashboard/presence";
import { ProductEmpty } from "@/components/dashboard/product-ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image, ArrowUpRight } from "lucide-react";
import { ProjectSummary, MessageThread } from "@/components/ecosystem/primitives";
import { sharedProjects } from "@/data/ecosystem";
import { useStudio } from "@/components/dashboard/context";
import { StudioLink } from "@/components/dashboard/controls";
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
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: StudioDestination,
});
function StudioDestination() {
 const { section } = Route.useParams();
 const { capabilities, monetizationEnabled, state } = useStudio();
 const allowed = !((section === "sell" && !capabilities.sellsWorks) || (section === "services" && !capabilities.offersServices) || (section === "earnings" && !monetizationEnabled) || (section === "projects" && !(capabilities.acceptsCommissions || capabilities.offersServices || capabilities.acceptsBookings)));
 if(!allowed)return <ProductEmpty title="A studio that fits your practice." description="This workflow is not enabled for this artist preview." section="portfolio" action="Open portfolio"/>;
 const modules: Record<string, React.ComponentType> = {portfolio:PortfolioModule, work:PortfolioModule, sell:SellModule, services:ServicesModule, earnings:EarningsModule, projects:ProjectsModule, profile:ProfileModule, messages:MessagesModule, availability:AvailabilityModule};
 const Module=modules[section];
 if(Module)return <Module key={`${state}-${section}`}/>;
 return <ProductEmpty title="Your studio preferences" description="Account preferences are available in your shared account." section="profile" action="Manage profile"/>;
}
