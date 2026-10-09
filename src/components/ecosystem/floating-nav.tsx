import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Shared floating, fully rounded bottom navigation used by every dashboard shell on phones. */
export function FloatingNav({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 grid grid-flow-col auto-cols-fr items-center gap-1 rounded-full border border-border bg-background/95 p-1.5 shadow-[0_12px_36px_hsl(0_0%_7%/0.16)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </nav>
  );
}

/** Class for a nav item (apply to a router Link). */
export function floatingNavItem(active: boolean) {
  return cn(
    'flex h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-full text-[12px] font-medium transition-colors',
    active ? 'bg-studio-green text-paper' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
  );
}

/** Primary centred action (e.g. Create). */
export const floatingNavAction = 'mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-paper';
