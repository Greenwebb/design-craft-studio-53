import type { ReactNode } from 'react';
import { create } from 'zustand';
import { previewUser, type EcosystemUser, type PreviewScenario, type AccountContext } from '@/data/ecosystem';
type EcosystemState = { user: EcosystemUser; scenario: PreviewScenario; setScenario: (value: PreviewScenario) => void; setContext: (value: AccountContext) => void; becomeCreator: (name: string) => void };
// Global in-memory preview account (Zustand). UI-only; authorises nothing.
export const useEcosystemStore = create<EcosystemState>()((set) => ({
  scenario: 'artist-collector',
  user: previewUser('artist-collector'),
  setScenario: (value) => set({ scenario: value, user: previewUser(value) }),
  setContext: (value) => set((s) => ({ user: { ...s.user, activeContext: value } })),
  becomeCreator: (name) => set((s) => ({ user: { ...s.user, displayName: name || s.user.displayName, roles: [...new Set([...s.user.roles, 'creator' as const])], activeContext: 'creator', creatorProfile: { slug: 'preview' } } })),
}));
export function EcosystemProvider({ children }: { children: ReactNode }) { return <>{children}</>; }
export function useEcosystem() { return useEcosystemStore(); }
