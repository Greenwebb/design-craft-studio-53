import { createContext, useContext, useState, type ReactNode } from 'react';
import { previewUser, type EcosystemUser, type PreviewScenario, type AccountContext } from '@/data/ecosystem';
type Context = { user: EcosystemUser; scenario: PreviewScenario; setScenario: (value: PreviewScenario) => void; setContext: (value: AccountContext) => void; becomeCreator: (name: string) => void };
const EcosystemContext = createContext<Context | null>(null);
export function EcosystemProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<PreviewScenario>('artist-collector');
  const [user, setUser] = useState(() => previewUser('artist-collector'));
  const setScenario = (value: PreviewScenario) => { setScenarioState(value); setUser(previewUser(value)); };
  const setContext = (value: AccountContext) => setUser(previous => ({ ...previous, activeContext: value }));
  const becomeCreator = (name: string) => setUser(previous => ({ ...previous, displayName: name || previous.displayName, roles: [...new Set([...previous.roles, 'creator' as const])], activeContext: 'creator', creatorProfile: { slug: 'preview' } }));
  return <EcosystemContext.Provider value={{ user, scenario, setScenario, setContext, becomeCreator }}>{children}</EcosystemContext.Provider>;
}
export function useEcosystem() { const value = useContext(EcosystemContext); if (!value) throw new Error('EcosystemProvider is required'); return value; }
