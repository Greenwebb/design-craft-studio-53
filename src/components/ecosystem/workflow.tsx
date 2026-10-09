import { Check } from 'lucide-react';
import type { Stage } from '@/data/workflows';

/** Reusable state tracker for every workflow (commission, fulfilment, payouts). */
export function StageTracker({ stages, current, label }: { stages: Stage[]; current: number; label: string }) {
  return (
    <ol aria-label={label} className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
      {stages.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <li key={s.id} aria-current={active ? 'step' : undefined} className={`rounded-lg border p-4 ${active ? 'border-studio-green bg-studio-green/8' : 'border-border'}`}>
            <span className={`mb-3 grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${done ? 'bg-studio-green text-primary-foreground' : active ? 'border-2 border-studio-green text-studio-green' : 'bg-muted text-muted-foreground'}`}>
              {done ? <Check size={18} /> : i + 1}
            </span>
            <p className={`text-base font-medium ${!done && !active ? 'text-muted-foreground' : ''}`}>{s.label}</p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{s.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}
