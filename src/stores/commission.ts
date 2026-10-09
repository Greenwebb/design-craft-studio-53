import { create } from 'zustand';
import { commissionStages } from '@/data/workflows';
export type CommissionBrief = { title: string; description: string; size: string; budget: string; deadline: string };
type CommissionState = {
  stage: number; brief: CommissionBrief; revisionNote: string;
  setBrief: (patch: Partial<CommissionBrief>) => void;
  goTo: (stage: number) => void; requestRevision: (note: string) => void; reset: () => void;
};
const emptyBrief: CommissionBrief = { title: '', description: '', size: '', budget: '', deadline: '' };
// Preview of the Request → Project created state machine. Nothing is sent or charged.
export const useCommission = create<CommissionState>()((set) => ({
  stage: 0, brief: emptyBrief, revisionNote: '',
  setBrief: (patch) => set((s) => ({ brief: { ...s.brief, ...patch } })),
  goTo: (stage) => set({ stage: Math.max(0, Math.min(stage, commissionStages.length - 1)) }),
  requestRevision: (note) => set({ stage: 3, revisionNote: note }),
  reset: () => set({ stage: 0, brief: emptyBrief, revisionNote: '' }),
}));
