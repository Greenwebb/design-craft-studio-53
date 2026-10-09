import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { AdminPage } from '@/components/admin/admin-ui';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/account')({ head: () => pageHead('My account', 'Your staff profile, security and preferences.', true), component: AccountLayout });

const tabs = [
  { to: '/admin/account', label: 'Profile', exact: true }, { to: '/admin/account/security', label: 'Security' },
  { to: '/admin/account/notifications', label: 'Notifications' }, { to: '/admin/account/preferences', label: 'Preferences' },
  { to: '/admin/account/activity', label: 'My activity' },
] as const;

function AccountLayout() {
  return (
    <AdminPage title="My account">
      <nav aria-label="Account sections" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: 'exact' in t }} activeProps={{ className: 'bg-ink text-ink-foreground border-ink' }}
            className="shrink-0 rounded-full border border-border px-5 py-2.5 text-[15px] font-medium hover:bg-secondary">{t.label}</Link>
        ))}
      </nav>
      <Outlet />
    </AdminPage>
  );
}
