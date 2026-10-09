import { useState, type ReactNode } from 'react';
import { create } from 'zustand';
import { Link } from '@tanstack/react-router';
import * as Dialog from '@radix-ui/react-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, History, Lock, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobilePageHeader, SearchButton, NotificationButton, BackButton } from '@/components/ecosystem/top-bar';
import { AccountMenu } from '@/components/ecosystem/account-menu';
import { actionsFor, useAdminOps, type AdminResources } from '@/stores/admin-ops';
import { currentStaff, type ActionDef, type BaseRow } from '@/data/admin-data';

// ---------- global admin search state (palette lives in the shell) ----------
export const useAdminSearch = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({
  open: false, setOpen: (open) => set({ open }),
}));

// ---------- status design: color + text, never color alone ----------
type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';
const toneClass: Record<Tone, string> = {
  success: 'bg-studio-success/10 text-studio-success',
  danger: 'bg-studio-danger/10 text-studio-danger',
  warning: 'bg-studio-warning/12 text-studio-warning',
  info: 'bg-studio-info/10 text-studio-info',
  neutral: 'bg-foreground/5 text-muted-foreground',
};
const toneOf = (state: string): Tone => {
  const s = state.toLowerCase();
  if (['paid', 'completed', 'verified', 'delivered', 'published', 'resolved', 'active', 'sent'].includes(s)) return 'success';
  if (['failed', 'rejected', 'disputed', 'chargeback', 'suspended', 'escalated', 'removed', 'delivery-issue', 'declined'].includes(s)) return 'danger';
  if (['pending', 'payment-pending', 'on-hold', 'needs-info', 'action-required', 'reschedule-requested', 'no-show', 'awaiting-customer', 'awaiting-creator', 'paused', 'under-review', 'reported', 'appealed', 'held'].includes(s)) return 'warning';
  if (['processing', 'in-progress', 'in-transit', 'dispatched', 'preparing', 'ready', 'requested', 'open', 'creator-confirmation', 'submitted', 'scheduled', 'review'].includes(s)) return 'info';
  return 'neutral';
};
export function StatusPill({ state, className }: { state: string; className?: string }) {
  const tone = toneOf(state);
  return <span className={cn('inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium capitalize', toneClass[tone], className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />{state.replaceAll('-', ' ')}
  </span>;
}

// ---------- dialogs: centered on desktop, bottom drawer on phones ----------
export function AdminDialog({ open, onOpenChange, title, description, children, wide }: {
  open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string; children: ReactNode; wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-[2px]" />
        <Dialog.Content className="studio fixed inset-x-0 bottom-0 z-50 flex max-h-[88svh] flex-col rounded-t-2xl border border-border bg-studio-surface shadow-lg focus:outline-none sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
          <div className={cn('w-full overflow-y-auto p-6 sm:p-8', wide ? 'sm:max-w-2xl' : 'sm:max-w-lg', 'mx-auto')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-2xl font-semibold tracking-tight">{title}</Dialog.Title>
                {description && <Dialog.Description className="mt-2 text-base text-muted-foreground">{description}</Dialog.Description>}
              </div>
              <Dialog.Close asChild><button aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary"><X size={20} /></button></Dialog.Close>
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const money = (n: number) => `K${n.toLocaleString('en-US')}`;

// ---------- sensitive action confirmation ----------
export function ActionDialog({ resource, id, action, record, open, onClose }: {
  resource: keyof AdminResources; id: string; action: ActionDef; record: BaseRow; open: boolean; onClose: () => void;
}) {
  const act = useAdminOps((s) => s.act);
  const [reason, setReason] = useState('');
  const amount = typeof record.amount === 'number' ? record.amount : typeof record.total === 'number' ? (record.total as number) : undefined;
  const blocked = action.requiresReason && reason.trim().length < 4;
  return (
    <AdminDialog open={open} onOpenChange={(v) => { if (!v) { setReason(''); onClose(); } }} title={action.label}
      description={amount !== undefined && action.financial ? `Financial action · ${money(amount)}` : 'Sensitive action — this is recorded in the audit trail.'}>
      {action.consequences && (
        <div className="rounded-xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">This will</p>
          <ul className="mt-3 space-y-2">
            {action.consequences.map((c) => <li key={c} className="flex items-start gap-2.5 text-[15px]"><Check size={18} className="mt-0.5 shrink-0 text-studio-green" />{c}</li>)}
          </ul>
        </div>
      )}
      <div className="mt-5 space-y-4">
        {action.requiresReason && (
          <label className="block">
            <span className="text-sm font-medium">Reason <span className="text-studio-danger">*</span></span>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required
              placeholder="Recorded on the audit trail with your name" className="studio-input mt-2 resize-none" />
          </label>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Dialog.Close asChild>
            <button className="rounded-full border border-border px-6 py-3 text-base font-medium hover:bg-secondary">Cancel</button>
          </Dialog.Close>
          <button disabled={blocked} onClick={() => { act(resource, id, action, { reason: reason.trim() || undefined }); setReason(''); onClose(); }}
            className={cn('rounded-full px-6 py-3 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
              action.tone === 'danger' ? 'bg-studio-danger text-white hover:bg-studio-danger/90'
                : action.tone === 'primary' ? 'bg-ink text-ink-foreground hover:bg-ink/90' : 'border border-border hover:bg-secondary')}>
            Confirm{action.requiresReason ? ' with reason' : ''}
          </button>
        </div>
      </div>
    </AdminDialog>
  );
}

// ---------- actions panel on a record ----------
export function ActionsPanel({ resource, record, className }: { resource: keyof AdminResources; record: BaseRow; className?: string }) {
  const available = actionsFor(resource, record.state);
  const [pending, setPending] = useState<ActionDef | null>(null);
  if (!available.length) return null;
  return (
    <div className={className}>
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Actions available</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {available.map((a) => (
          <button key={a.id} onClick={() => setPending(a)}
            className={cn('inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors',
              a.tone === 'danger' ? 'border border-studio-danger/40 text-studio-danger hover:bg-studio-danger/8'
                : a.tone === 'primary' ? 'bg-ink text-ink-foreground hover:bg-ink/90' : 'border border-border hover:bg-secondary')}>
            {a.financial && <Lock size={16} aria-hidden />}{a.label}
          </button>
        ))}
      </div>
      {pending && <ActionDialog resource={resource} id={record.id} action={pending} record={record} open onClose={() => setPending(null)} />}
    </div>
  );
}

// ---------- internal notes ----------
export function InternalNotes({ resource, record }: { resource: keyof AdminResources; record: BaseRow }) {
  const addNote = useAdminOps((s) => s.addNote);
  const [body, setBody] = useState('');
  const notes = record.notes ?? [];
  return (
    <section>
      <h2 className="text-xl font-semibold">Internal notes</h2>
      <p className="mt-1 text-sm text-muted-foreground">Never visible to customers or creators.</p>
      {notes.length > 0 && (
        <ul className="mt-4 space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-studio-warning/30 bg-studio-warning/6 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-studio-warning/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-studio-warning">Internal note</span>
                <span className="text-sm font-medium">{n.author}</span><span className="text-sm text-muted-foreground">· {n.at}</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); addNote(resource, record.id, body); setBody(''); }}>
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add an internal note…" className="studio-input flex-1" />
        <button type="submit" disabled={!body.trim()} className="rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-ink-foreground hover:bg-ink/90 disabled:opacity-40 sm:self-auto">
          <Plus size={18} className="mr-1 inline" />Add note
        </button>
      </form>
    </section>
  );
}

// ---------- audit trail ----------
export function AuditTrail({ resource, id, seeded }: { resource: string; id: string; seeded?: { at: string; what: string; who?: string; reason?: string }[] }) {
  const audit = useAdminOps((s) => s.audit).filter((e) => e.resource === resource && e.resourceId === id);
  const entries = [...audit.map((e) => ({ at: e.at, what: e.action, who: `${e.actor} · ${e.actorRole}`, reason: e.reason })), ...(seeded ?? [])];
  return (
    <section>
      <h2 className="text-xl font-semibold"><History size={20} className="mr-2 inline text-studio-green" aria-hidden />Audit trail</h2>
      {entries.length === 0 ? (
        <p className="mt-3 text-[15px] text-muted-foreground">No actions recorded yet. Every sensitive action on this record will appear here.</p>
      ) : (
        <ol className="mt-4 space-y-0">
          {entries.map((e, i) => (
            <li key={i} className="relative border-l border-border pb-5 pl-6 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-studio-green" aria-hidden />
              <p className="text-[15px] font-medium">{e.what}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{e.at}{e.who ? ` · ${e.who}` : ''}</p>
              {e.reason && <p className="mt-1 text-sm text-muted-foreground">Reason: {e.reason}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

// ---------- conversation thread ----------
export function ThreadSection({ resource, id, thread, replyAs }: {
  resource: 'disputes' | 'support'; id: string; thread: { id: string; from: string; body: string; at: string }[]; replyAs: string;
}) {
  const reply = useAdminOps((s) => s.reply);
  const [body, setBody] = useState('');
  return (
    <section>
      <h2 className="text-xl font-semibold">Conversation</h2>
      <ul className="mt-4 space-y-4">
        {thread.map((m) => (
          <li key={m.id} className={cn('rounded-xl p-4', m.from === 'System' ? 'border border-dashed border-border bg-background' : 'bg-secondary')}>
            <div className="flex justify-between gap-4 text-sm"><span className="font-medium">{m.from}</span><span className="text-muted-foreground">{m.at}</span></div>
            <p className="mt-2 text-[15px] leading-relaxed">{m.body}</p>
          </li>
        ))}
      </ul>
      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); reply(resource, id, body, replyAs); setBody(''); }}>
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Reply as ${replyAs}…`} className="studio-input flex-1" />
        <button type="submit" disabled={!body.trim()} className="rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-ink-foreground hover:bg-ink/90 disabled:opacity-40 sm:self-auto">Send</button>
      </form>
    </section>
  );
}

// ---------- page header (shared with every admin page) ----------
export function AdminPageHeader({ title, back, actions, children, secondaryContent }: {
  title: string; back?: boolean; actions?: ReactNode; children?: ReactNode; secondaryContent?: ReactNode;
}) {
  return (
    <MobilePageHeader title={title} back={back ? { visible: true } : undefined} secondaryContent={secondaryContent}
      actions={<>
        {actions}
        <SearchButton onClick={() => useAdminSearch.getState().setOpen(true)} label="Search operations" />
        <NotificationButton unread label="Operations alerts" />
        <AccountMenu context="public" />
      </>}>
      {children}
    </MobilePageHeader>
  );
}

export function AdminPage({ title, back, actions, children, className }: {
  title: string; back?: boolean; actions?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <AdminPageHeader title={title} back={back} actions={actions} />
      <div className="mx-auto max-w-[1360px] space-y-10 px-[18px] pb-32 pt-8 sm:px-7 sm:pb-12 lg:px-10">{children}</div>
    </div>
  );
}

// ---------- filters ----------
export function FilterTabs({ options, value, onChange }: { options: { value: string; label: string; count?: number }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={cn('shrink-0 rounded-full px-4 py-2 text-[15px] font-medium transition-colors',
            value === o.value ? 'bg-ink text-ink-foreground' : 'border border-border hover:bg-secondary')}>
          {o.label}{o.count !== undefined && <span className={cn('ml-1.5 text-sm', value === o.value ? 'text-ink-foreground/70' : 'text-muted-foreground')}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function DropdownFilter({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[15px] font-medium hover:bg-secondary">
        {current && current.value !== 'all' ? current.label : label}<ChevronDown size={18} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto rounded-xl">
        {options.map((o) => <DropdownMenuItem key={o.value} onClick={() => onChange(o.value)} className={cn('rounded-full px-4 py-2.5 text-[15px]', o.value === value && 'bg-studio-green/8 font-medium text-studio-green')}>{o.label}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------- operational table (desktop) that becomes cards on phones ----------
export type Column<T> = { key: string; label: string; className?: string; render?: (row: T) => ReactNode };
export function AdminTable<T extends { id: string }>({ columns, rows, hrefFor, emptyTitle, emptyDetail }: {
  columns: Column<T>[]; rows: T[]; hrefFor: (row: T) => string; emptyTitle: string; emptyDetail?: string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-border p-10 text-center">
        <p className="text-lg font-medium">{emptyTitle}</p>
        {emptyDetail && <p className="mt-2 text-[15px] text-muted-foreground">{emptyDetail}</p>}
      </div>
    );
  }
  return (
    <>
      {/* Desktop table */}
      <div className="studio-panel hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => <th key={c.key} className="sticky top-0 bg-studio-surface px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</th>)}
              <th className="sticky top-0 bg-studio-surface px-5 py-4" aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50">
                {columns.map((c) => <td key={c.key} className={cn('px-5 py-4 align-middle text-[15px]', c.className)}>{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}</td>)}
                <td className="px-5 py-4 text-right">
                  <Link to={hrefFor(row)} className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phone / tablet cards */}
      <ul className="space-y-3 lg:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <Link to={hrefFor(row)} className="studio-panel studio-hover block p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {columns.slice(0, 2).map((c, i) => <div key={c.key} className={cn(i === 0 ? 'truncate text-[15px] font-medium' : 'mt-1 truncate text-sm text-muted-foreground', c.className)}>{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}</div>)}
                </div>
                {columns[columns.length - 1]?.render && <div className="shrink-0">{columns[columns.length - 1].render?.(row)}</div>}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {columns.slice(2, -1).map((c) => <span key={c.key} className="truncate">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}</span>)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

// ---------- small fact / field helpers for detail pages ----------
export function Fact({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={className}><p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><div className="mt-1.5 text-[15px]">{children}</div></div>;
}
export function FactGrid({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 }) {
  return <div className={cn('grid gap-x-8 gap-y-6 sm:grid-cols-2', cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>{children}</div>;
}
export function SectionCard({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="studio-panel p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>{aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
export const staffBadge = `${currentStaff.name} · ${currentStaff.role}`;
