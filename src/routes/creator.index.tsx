import { createFileRoute } from "@tanstack/react-router";
import { StudioHome, StudioSkeleton } from "@/components/creator/home";
export const Route = createFileRoute("/creator/")({
  head: () => ({
    meta: [
      { title: "Your creative studio — I Am An Artist" },
      {
        name: "description",
        content: "Your work, opportunities and creative momentum in one personal studio.",
      },
      { property: "og:title", content: "Your creative studio — I Am An Artist" },
      {
        property: "og:description",
        content: "A personal studio for shaping your creative presence.",
      },
      { name: "robots", content: "noindex" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioHome,
  pendingComponent: StudioSkeleton,
});
