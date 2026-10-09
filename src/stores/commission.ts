import { create } from 'zustand';
import { commissionStages } from '@/data/workflows';
export type CommissionBrief = { artist: string; title: string; description: string; size: string; budget: string; deadline: string };
type CommissionState = {
  stage: number; brief: CommissionBrief; revisionNote: string;
  setBrief: (patch: Partial<CommissionBrief>) => void;
  advance: () => void; requestRevision: (note: string) => void; reset: () => void;
};
const emptyBrief: CommissionBrief = { artist: '', title: '', description: '', size: '', budget: '', deadline: '' };
// Preview of the Request → Project created state machine. Nothing is sent or charged.
export const useCommission = create<CommissionState>()((set) => ({
  stage: 0, brief: emptyBrief, revisionNote: '',
  setBrief: (patch) => set((s) => ({ brief: { ...s.brief, ...patch } })),
  advance: () => set((s) => ({ stage: Math.min(s.stage + (s.stage === 2 ? 2 : 1), commissionStages.length - 1) })),
  requestRevision: (note) => set({ stage: 3, revisionNote: note }),
  reset: () => set({ stage: 0, brief: emptyBrief, revisionNote: '' }),
}));
