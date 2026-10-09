import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSearch } from './admin-ui';
import { searchIndex } from '@/data/admin-data';

// Global operations search — users, orders, projects, payments, works, disputes.
// Opened from any admin page header or with Ctrl/Cmd + K.
export function AdminSearch() {
  const { open, setOpen } = useAdminSearch();
  const navigate = useNavigate();
  const go = (to: string) => { setOpen(false); void navigate({ to }); };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-[2px]" />
        <Dialog.Content className="studio fixed left-1/2 top-[8%] z-50 w-[calc(100%-36px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-studio-surface shadow-lg focus:outline-none">
          <Dialog.Title className="sr-only">Search operations</Dialog.Title>
          <Dialog.Description className="sr-only">Search users, orders, projects, payments, works and disputes.</Dialog.Description>
          <Command label="Operations search">
            <div className="flex items-center gap-3 border-b border-border px-5">
              <Search size={20} className="text-studio-green" />
              <Command.Input autoFocus placeholder="Search users, orders, payments, works, disputes…" aria-label="Search operations"
                className="h-16 min-w-0 flex-1 bg-transparent text-base outline-none" />
              <Dialog.Close asChild><button aria-label="Close search" className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary"><X size={18} /></button></Dialog.Close>
            </div>
            <Command.List className="max-h-[60svh] overflow-y-auto p-3">
              <Command.Empty className="p-8 text-center text-sm text-muted-foreground">No matching records. Try an ID, name, email or artwork title.</Command.Empty>
              {['Users', 'Creators', 'Orders', 'Payments', 'Works', 'Disputes', 'Payouts'].map((group) => {
                const items = searchIndex.filter((i) => i.group === group);
                if (!items.length) return null;
                return (
                  <Command.Group key={group} heading={group} className="studio-command-group">
                    {items.map((i) => (
                      <Command.Item key={i.to + i.label} value={`${i.label} ${i.sub}`} onSelect={() => go(i.to)} className="studio-command-item">
                        <div className="min-w-0"><p className="truncate">{i.label}</p><p className="truncate text-[12px] text-muted-foreground">{i.sub}</p></div>
                        <ArrowUpRight size={16} className="ml-auto shrink-0" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                );
              })}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
