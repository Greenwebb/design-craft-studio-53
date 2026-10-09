import { Link } from '@tanstack/react-router';
import { Bell, LogOut, Shield, Store, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSignOut } from '@/components/settings/hub';
import { roleOf, useAdminTeam, type Staff } from '@/stores/admin-team';

export const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export function useMe(): Staff {
  return useAdminTeam((s) => s.staff.find((x) => x.id === s.meId)!);
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return <span style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-full bg-studio-green/10 text-sm font-semibold text-studio-green">{initials(name)}</span>;
}

// Admin avatar menu — staff account only, never the marketplace profile.
export function AdminAccountMenu() {
  const me = useMe();
  const role = useAdminTeam((s) => roleOf(s.roles, me.roleId)?.label);
  const signOut = useSignOut();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="Your admin account" className="rounded-full focus-visible:outline-2"><Avatar name={me.name} size={36} /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-background p-2">
        <div className="px-3 py-3"><p className="text-[15px] font-semibold">{me.name}</p><p className="mt-0.5 text-sm text-muted-foreground">{role}</p></div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/admin/account"><User size={18} />My account</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/admin/account/security"><Shield size={18} />Security</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/admin/account/notifications"><Bell size={18} />Notifications</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/"><Store size={18} />Switch to marketplace</Link></DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void signOut()}><LogOut size={18} />Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Toggle({ on, onChange, label, disabled }: { on: boolean; onChange: () => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-40 ${on ? 'bg-studio-green' : 'bg-foreground/15'}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-background shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="text-sm font-medium">{label}</span><div className="mt-2">{children}</div></label>;
}
