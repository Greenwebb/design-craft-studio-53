import { createFileRoute, redirect } from "@tanstack/react-router";
import { safeReturn } from "@/components/auth/kit";

// Legacy path: sign-in now lives at /login.
export const Route = createFileRoute("/auth")({
  beforeLoad: ({ search }) => {
    const r = safeReturn((search as Record<string, unknown>)["next"]);
    throw redirect({ to: "/login", search: r ? { returnTo: r } : {} });
  },
});
