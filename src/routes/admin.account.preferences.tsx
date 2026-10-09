import { createFileRoute } from '@tanstack/react-router';
import { Field } from '@/components/admin/admin-account';
import { SectionCard } from '@/components/admin/admin-ui';
import { adminNav } from '@/data/admin-data';
import { useAdminTeam } from '@/stores/admin-team';

export const Route = createFileRoute('/admin/account/preferences')({ component: Prefs });

function Prefs() {
  const prefs = useAdminTeam((s) => s.prefs);
  const set = useAdminTeam((s) => s.setPrefs);
  const pages = adminNav.flatMap((g) => g.items);
  return (
    <SectionCard title="Preferences">
      <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
        <Field label="Default landing page"><select value={prefs.landing} onChange={(e) => set({ landing: e.target.value })} className="studio-input">{pages.map((p) => <option key={p.id} value={p.to}>{p.label}</option>)}</select></Field>
        <Field label="Table density"><select value={prefs.density} onChange={(e) => set({ density: e.target.value as 'comfortable' | 'compact' })} className="studio-input"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></Field>
        <Field label="Timezone"><select value={prefs.timezone} onChange={(e) => set({ timezone: e.target.value })} className="studio-input">{['Africa/Lusaka (UTC+2)', 'Africa/Johannesburg (UTC+2)', 'Africa/Nairobi (UTC+3)', 'Europe/London (UTC+0)'].map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Date format"><select value={prefs.dateFormat} onChange={(e) => set({ dateFormat: e.target.value })} className="studio-input">{['9 Oct 2026', '09/10/2026', '2026-10-09'].map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Language"><select value={prefs.language} onChange={(e) => set({ language: e.target.value })} className="studio-input"><option>English</option></select></Field>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Changes save automatically for this session.</p>
    </SectionCard>
  );
}
