import { createFileRoute } from '@tanstack/react-router';
import { AdminPage, SectionCard } from '@/components/admin/admin-ui';
import { capabilityMatrix, featureFlags, feeSettings, providerSettings, settingsGroups, staffRoles } from '@/data/admin-data';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/admin/settings')({ head: () => pageHead('Settings', 'Marketplace configuration, fees and staff permissions.', true), component: SettingsAdmin });

function SettingsAdmin() {
  return (
    <AdminPage title="Settings">
      <SectionCard title="Configuration areas">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {settingsGroups.map((g) => (
            <div key={g.id} className="rounded-xl border border-border p-5"><p className="font-medium">{g.label}</p><p className="mt-1 text-sm text-muted-foreground">{g.detail}</p></div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Marketplace fees" aside={<span className="text-sm text-muted-foreground">Versioned · changes never apply to accepted projects</span>}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {feeSettings.map((f) => (
            <div key={f.label} className="rounded-xl border border-border p-5">
              <p className="text-sm text-muted-foreground">{f.label}</p>
              <p className="mt-1 text-2xl font-semibold">{f.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">Updated {f.updated}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Payment providers" aside={<span className="text-sm text-muted-foreground">Keys and secrets stay server-side — never shown here</span>}>
        <div className="space-y-3">
          {providerSettings.map((p) => (
            <div key={p.provider} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-5">
              <div><p className="font-medium">{p.provider}</p><p className="text-sm text-muted-foreground">{p.methods}</p></div>
              <div className="text-right text-sm text-muted-foreground"><p>{p.environment}</p><p className="font-medium text-studio-success">{p.status}</p></div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Feature flags">
        <div className="grid gap-3 sm:grid-cols-3">
          {featureFlags.map((f) => (
            <div key={f.flag} className="rounded-xl border border-border p-5"><p className="font-medium">{f.flag}</p><p className="mt-1 text-sm text-muted-foreground">{f.state} · {f.rollout}</p></div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Staff roles" aside={<span className="text-sm text-muted-foreground">Capability-based — the backend enforces, navigation hiding does not</span>}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {staffRoles.map((r) => (
            <div key={r.id} className="rounded-xl border border-border p-5"><p className="font-medium">{r.label}</p><p className="mt-1 text-sm text-muted-foreground">{r.can}</p></div>
          ))}
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead><tr className="border-b border-border">
              <th className="px-3 py-3 font-semibold text-muted-foreground">Capability</th>
              {capabilityMatrix.roles.map((r) => <th key={r} className="px-3 py-3 font-semibold text-muted-foreground">{r}</th>)}
            </tr></thead>
            <tbody>
              {capabilityMatrix.caps.map((cap) => (
                <tr key={cap} className="border-b border-border/60">
                  <td className="px-3 py-3 font-medium">{cap}</td>
                  {capabilityMatrix.grid[cap].map((on, i) => <td key={i} className="px-3 py-3">{on ? <span className="text-studio-success">✓</span> : <span className="text-muted-foreground/50">—</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AdminPage>
  );
}
