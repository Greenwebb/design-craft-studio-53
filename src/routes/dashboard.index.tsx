import { createFileRoute } from "@tanstack/react-router";
import { StudioHome, StudioSkeleton } from "@/components/dashboard/home";
export const Route = createFileRoute("/dashboard/")({
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
    ],
  }),
  component: StudioHome,
  pendingComponent: StudioSkeleton,
});
