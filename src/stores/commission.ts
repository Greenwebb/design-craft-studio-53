import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { commissionStages } from '@/data/workflows';

export type CommissionBrief = { title: string; description: string; size: string; budget: string; deadline: string };
export type ProposalLine = { title: string; amount: number };
export type ProposalVersion = { version: number; lines: ProposalLine[]; weeks: number; note: string; sentAt: string };
export type ThreadMessage = { id: string; from: 'customer' | 'creator'; body: string; at: string };
export type CommissionStatus = 'draft' | 'active' | 'cancelled' | 'declined';

type CommissionState = {
  artistSlug: string; artistName: string;
  stage: number; status: CommissionStatus; cancelReason: string;
  brief: CommissionBrief; answers: Record<string, string>; references: string[];
  revisionNote: string; proposals: ProposalVersion[]; thread: ThreadMessage[];
  draftSavedAt: string | null; error: string | null;
  start: (slug: string, name: string) => void;
  setBrief: (patch: Partial<CommissionBrief>) => void;
  setAnswer: (q: string, a: string) => void;
  addReferences: (names: string[]) => void; removeReference: (name: string) => void;
  saveDraft: () => void;
  submitRequest: () => boolean;
  creatorAsk: (question: string) => void;
  customerReply: (body: string) => void;
  sendProposal: (p: Omit<ProposalVersion, 'version' | 'sentAt'>) => void;
  requestRevision: (note: string) => void;
  accept: () => void; payDeposit: (fail?: boolean) => void;
  cancel: (by: 'customer' | 'creator', reason: string) => void;
  goTo: (stage: number) => void; clearError: () => void; reset: () => void;
};

const emptyBrief: CommissionBrief = { title: '', description: '', size: '', budget: '', deadline: '' };
const now = () => new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const id = () => Math.random().toString(36).slice(2, 9);
const clamp = (s: number) => Math.max(0, Math.min(s, commissionStages.length - 1));
const initial = { artistSlug: '', artistName: '', stage: 0, status: 'draft' as CommissionStatus, cancelReason: '', brief: emptyBrief, answers: {}, references: [], revisionNote: '', proposals: [], thread: [], draftSavedAt: null, error: null };

export const proposalTotal = (p?: ProposalVersion) => (p ? p.lines.reduce((s, l) => s + l.amount, 0) : 0);
export const kwacha = (n: number) => `K${n.toLocaleString('en-US')}`;

// Preview of the Request → Project created state machine, shared by the customer
// page and the creator inbox in this browser. Nothing is sent or charged.
export const useCommission = create<CommissionState>()(persist((set, get) => ({
  ...initial,
  start: (slug, name) => { if (get().artistSlug !== slug) set({ ...initial, artistSlug: slug, artistName: name }); },
  setBrief: (patch) => set((s) => ({ brief: { ...s.brief, ...patch } })),
  setAnswer: (q, a) => set((s) => ({ answers: { ...s.answers, [q]: a } })),
  addReferences: (names) => set((s) => ({ references: [...new Set([...s.references, ...names])].slice(0, 8) })),
  removeReference: (name) => set((s) => ({ references: s.references.filter((r) => r !== name) })),
  saveDraft: () => set({ draftSavedAt: now() }),
  submitRequest: () => {
    const { brief } = get();
    if (brief.title.trim().length < 3 || brief.description.trim().length < 20) { set({ error: 'Add a project title and at least a couple of sentences describing your idea.' }); return false; }
    set((s) => ({ stage: 1, status: 'active', error: null, thread: [...s.thread, { id: id(), from: 'customer', body: `New request: ${brief.title}`, at: now() }] }));
    return true;
  },
  creatorAsk: (question) => set((s) => ({ stage: 1, thread: [...s.thread, { id: id(), from: 'creator', body: question, at: now() }] })),
  customerReply: (body) => set((s) => ({ thread: [...s.thread, { id: id(), from: 'customer', body, at: now() }] })),
  sendProposal: (p) => set((s) => ({ stage: s.proposals.length ? 3 : 2, proposals: [...s.proposals, { ...p, version: s.proposals.length + 1, sentAt: now() }], thread: [...s.thread, { id: id(), from: 'creator', body: `Proposal v${s.proposals.length + 1} sent`, at: now() }] })),
  requestRevision: (note) => set((s) => ({ stage: 3, revisionNote: note, thread: [...s.thread, { id: id(), from: 'customer', body: `Revision requested: ${note}`, at: now() }] })),
  accept: () => set({ stage: 4, error: null }),
  payDeposit: (fail) => fail ? set({ error: 'The deposit didn’t go through. No money was taken — check your mobile money balance or try another method.' }) : set({ stage: 6, error: null }),
  cancel: (by, reason) => set((s) => ({ status: by === 'creator' ? 'declined' : 'cancelled', cancelReason: reason, thread: [...s.thread, { id: id(), from: by, body: `${by === 'creator' ? 'Declined' : 'Cancelled'}: ${reason}`, at: now() }] })),
  goTo: (stage) => set({ stage: clamp(stage) }),
  clearError: () => set({ error: null }),
  reset: () => set((s) => ({ ...initial, artistSlug: s.artistSlug, artistName: s.artistName })),
}), { name: 'iaaa-commission', storage: createJSONStorage(() => localStorage), skipHydration: true }));
