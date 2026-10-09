import type { ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bell, MoreHorizontal, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The single page header for every dashboard shell (creator, buying, admin, settings).
 * Pages only decide: title, back button, contextual actions, secondary row.
 * Height, spacing, typography, icon sizing, sticky + safe-area live here only.
 */
export type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  back?: { visible: boolean; onClick?: (() => void) | undefined };
  leading?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  secondaryContent?: ReactNode;
  sticky?: boolean;
};

export function MobilePageHeader({ title, eyebrow, back, leading, actions, children, secondaryContent, sticky = true }: PageHeaderProps) {
  return (
    <header className={cn("z-40 border-b border-foreground/[0.07] bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-md", sticky && "sticky top-0")}>
      <div className="flex min-h-[60px] items-center gap-3 px-4 sm:min-h-[72px] sm:px-7 xl:px-9">
        {back?.visible ? <BackButton onClick={back.onClick} /> : leading}
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="hidden truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:block">{eyebrow}</p>}
          <p className="truncate text-[21px] font-[560] leading-[1.1] tracking-[-0.025em] sm:text-xl sm:font-semibold">{title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">{actions}{children}</div>
      </div>
      {secondaryContent && <div className="overflow-x-auto px-4 pb-2 sm:px-7 xl:px-9">{secondaryContent}</div>}
    </header>
  );
}

/** Backwards-compatible name used by the shells. */
export const DashboardTopBar = MobilePageHeader;

/** Shared hit area / focus / stroke for every header utility. */
export const topBarIcon = "h-10 w-10 border-0 text-foreground/80 hover:text-foreground";
const iconBtn = "relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type BtnProps = { onClick?: (() => void) | undefined; label?: string; className?: string | undefined };

export function HeaderIconButton({ onClick, label, className, children, expanded }: BtnProps & { children: ReactNode; expanded?: boolean | undefined }) {
  return <button type="button" aria-label={label} title={label} aria-expanded={expanded} onClick={onClick} className={cn(iconBtn, className)}>{children}</button>;
}

/** Search is the first utility hidden on very narrow phones; account access never is. */
export function SearchButton({ onClick, label = "Search", className }: BtnProps) {
  return <HeaderIconButton onClick={onClick} label={label} className={cn("max-[359px]:hidden", className)}><Search size={20} strokeWidth={1.7} /></HeaderIconButton>;
}

export function NotificationButton({ onClick, label = "Notifications", unread, className }: BtnProps & { unread?: boolean }) {
  return (
    <HeaderIconButton onClick={onClick} label={unread ? `${label}, unread` : label} className={className}>
      <Bell size={20} strokeWidth={1.7} />
      {unread && <span aria-hidden className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-studio-copper" />}
    </HeaderIconButton>
  );
}

export function MoreButton({ onClick, label = "More options", className }: BtnProps) {
  return <HeaderIconButton onClick={onClick} label={label} className={className}><MoreHorizontal size={20} strokeWidth={1.7} /></HeaderIconButton>;
}

export function CreateButton({ onClick, label = "Create", className }: BtnProps) {
  return <HeaderIconButton onClick={onClick} label={label} className={cn("bg-ink text-paper hover:bg-ink/90 hover:text-paper", className)}><Plus size={20} strokeWidth={1.8} /></HeaderIconButton>;
}

export function BackButton({ onClick, label = "Back", className }: BtnProps) {
  const router = useRouter();
  return <HeaderIconButton onClick={onClick ?? (() => router.history.back())} label={label} className={cn("-ml-2", className)}><ArrowLeft size={20} strokeWidth={1.7} /></HeaderIconButton>;
}
