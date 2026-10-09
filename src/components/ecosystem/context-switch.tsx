import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Palette, ShoppingBag } from "lucide-react";
import { useEcosystem } from "./context";

type Ctx = "creator" | "customer";
const KEY = "iaaa:last-route";
function read(): Partial<Record<Ctx, string>> {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}

/** Floating "Switch to Buying / Creating" control; remembers last route per context. */
export function ContextSwitch({ context }: { context: Ctx }) {
  const { user, setContext } = useEcosystem();
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ ...read(), [context]: href })); } catch { /* ignore */ }
  }, [context, href]);

  const toCreating = context === "customer";
  const label = toCreating ? "Switch to Creating" : "Switch to Buying";
  const Icon = toCreating ? Palette : ShoppingBag;

  const go = () => {
    if (toCreating && !user.roles.includes("creator")) { void navigate({ to: "/join" }); return; }
    const target: Ctx = toCreating ? "creator" : "customer";
    const last = read()[target];
    setContext(target);
    if (last) void navigate({ href: last });
    else if (toCreating) void navigate({ to: "/creator", search: { artist: "painter" } });
    else void navigate({ to: "/account" });
  };

  return (
    <motion.button
      type="button"
      onClick={go}
      aria-label={label}
      title={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      whileHover="hover"
      className="group fixed bottom-[calc(92px+env(safe-area-inset-bottom))] right-4 z-[60] inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-ink px-3.5 text-[14px] font-medium text-paper shadow-[0_8px_28px_hsl(0_0%_7%/0.14)] transition-colors hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-[18px] lg:bottom-6 lg:right-6"
    >
      <motion.span variants={{ hover: { x: 3 } }} transition={{ duration: 0.2 }} className="inline-flex">
        <Icon size={18} aria-hidden />
      </motion.span>
      <span className="hidden min-[400px]:inline lg:hidden">{toCreating ? "Creating" : "Buying"}</span>
      <span className="hidden lg:inline">{label}</span>
    </motion.button>
  );
}
