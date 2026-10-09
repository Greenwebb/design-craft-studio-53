import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useStudio } from "./context";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
export function StudioLink({
  section,
  children,
  className = "",
  onClick,
  arrow = true,
}: {
  section: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  arrow?: boolean;
}) {
  const { state } = useStudio();
  return (
    <Link
      to="/creator/$section"
      params={{ section }}
      search={{ artist: state }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-60",
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight size={18} />}
    </Link>
  );
}
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <h2 className="text-[20px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function StudioCreateLink({kind,children}:{kind:'portfolio'|'work'|'service';children:ReactNode}){const {state}=useStudio();return <Button asChild className="h-auto px-4 py-2.5 text-xs"><Link to="/creator/new/$kind" params={{kind}} search={{artist:state}}>{children}</Link></Button>}
