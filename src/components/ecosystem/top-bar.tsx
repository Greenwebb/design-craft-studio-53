import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site";

/**
 * Shared dashboard top bar for creator, buying and admin shells.
 * Thin, editorial and calm: brand logo always visible (separate from the page title),
 * open breathing space, restrained controls right.
 */
export function DashboardTopBar({ title, eyebrow, leading, children }: { title: string; eyebrow?: string; leading?: ReactNode; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 grid h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-foreground/[0.08] bg-background/95 px-[18px] backdrop-blur-md sm:px-7 xl:px-9">
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <Link to="/" aria-label="I Am An Artist — back to the website" className="hidden shrink-0 items-center rounded-full sm:flex">
          <Logo className="h-8" />
        </Link>
        <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-foreground/[0.12] sm:block" />
        <div className="min-w-0">
          {eyebrow && <p className="truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>}
          <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">{children}</div>
    </header>
  );
}

/** Consistent quiet icon control size for the top bar. */
export const topBarIcon = "h-10 w-10 border-0 text-foreground/80 hover:text-foreground";
