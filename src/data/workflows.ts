// Single source of truth for every money and collaboration state machine.
// Preview only: no state here is persisted or authorises anything.
export type Stage = { id: string; label: string; detail: string; owner: 'customer' | 'creator' | 'platform' };

export const commissionStages: Stage[] = [
  { id: 'request', label: 'Request', detail: 'Collector shares the brief, size, budget and deadline.', owner: 'customer' },
  { id: 'questions', label: 'Questions', detail: 'Artist asks clarifying questions and gathers references.', owner: 'creator' },
  { id: 'proposal', label: 'Proposal', detail: 'Artist sends a quote with deliverables and milestones.', owner: 'creator' },
  { id: 'revision', label: 'Revision', detail: 'Collector asks for changes; artist updates the quote.', owner: 'customer' },
  { id: 'accept', label: 'Accept', detail: 'Collector accepts the final terms.', owner: 'customer' },
  { id: 'deposit', label: 'Deposit', detail: 'Deposit is paid and held until the first milestone.', owner: 'customer' },
  { id: 'project', label: 'Project created', detail: 'A shared workspace opens for both sides.', owner: 'platform' },
];

export const fulfilmentStages: Stage[] = [
  { id: 'paid', label: 'Paid', detail: 'Payment received and held.', owner: 'platform' },
  { id: 'confirmed', label: 'Creator confirms', detail: 'Artist confirms the work is available.', owner: 'creator' },
  { id: 'preparing', label: 'Preparing', detail: 'Framing, packing and certificate.', owner: 'creator' },
  { id: 'dispatch', label: 'Collection / Dispatch', detail: 'Handed to courier or ready for pickup.', owner: 'creator' },
  { id: 'delivered', label: 'Delivered', detail: 'Collector receives the work.', owner: 'customer' },
  { id: 'completed', label: 'Completed', detail: 'Inspection window closes; funds release.', owner: 'platform' },
];

export const payoutStages: Stage[] = [
  { id: 'pending', label: 'Pending', detail: 'Held until delivery or milestone approval.', owner: 'platform' },
  { id: 'available', label: 'Available', detail: 'Cleared and ready to withdraw.', owner: 'creator' },
  { id: 'withdraw', label: 'Withdraw', detail: 'Artist requests a payout.', owner: 'creator' },
  { id: 'processing', label: 'Processing', detail: 'Sent to mobile money or bank.', owner: 'platform' },
  { id: 'paid', label: 'Paid', detail: 'Funds arrived in the artist’s account.', owner: 'platform' },
];

export const payoutExceptions = [
  { label: 'Platform fee', detail: '10% deducted before funds become available.' },
  { label: 'Reversal', detail: 'Refunds or upheld disputes return pending funds to the collector.' },
  { label: 'Failed payout', detail: 'Rejected transfers return to Available with a reason to fix.' },
];

export const workspaceTabs = ['Overview', 'Messages', 'Files', 'Milestones', 'Payments', 'Timeline'] as const;
export type WorkspaceTab = (typeof workspaceTabs)[number];

export const projectMilestones = [
  { title: 'Deposit', amount: 'K4,500', share: '30%', state: 'Paid' },
  { title: 'Concept approval', amount: 'K6,000', share: '40%', state: 'Awaiting approval' },
  { title: 'Final delivery', amount: 'K4,500', share: '30%', state: 'Upcoming' },
];
export const projectFiles = [
  { name: 'Signed proposal.pdf', size: '220 KB', by: 'Platform' },
  { name: 'Lobby reference photos.zip', size: '18 MB', by: 'Collector' },
  { name: 'Concept 2 — landscape.jpg', size: '4.2 MB', by: 'Artist' },
];
export const projectTimeline = [
  { when: '2 Sep', what: 'Request sent' }, { when: '4 Sep', what: 'Proposal sent' }, { when: '6 Sep', what: 'Revision requested' },
  { when: '7 Sep', what: 'Proposal accepted · Deposit paid' }, { when: '20 Sep', what: 'Concept 2 shared for approval' },
];

export const adminSections = [
  { id: 'disputes', label: 'Disputes', count: 3 },
  { id: 'refunds', label: 'Refunds', count: 2 },
  { id: 'payouts', label: 'Payouts', count: 7 },
  { id: 'moderation', label: 'Moderation', count: 12 },
  { id: 'support', label: 'Support', count: 5 },
] as const;
export const adminQueue: Record<string, { id: string; title: string; who: string; state: string }[]> = {
  disputes: [{ id: 'D-104', title: 'Hotel Lobby Mural · concept not as agreed', who: 'Latitude Hotel ↔ Mwansa Chileshe', state: 'Needs review' }, { id: 'D-101', title: 'Print arrived damaged', who: 'Sarah Banda', state: 'Awaiting evidence' }],
  refunds: [{ id: 'R-58', title: 'After the Rain · damaged in transit', who: 'Sarah Banda', state: 'Approve or decline' }],
  payouts: [{ id: 'P-322', title: 'K8,200 to Airtel Money', who: 'Mwansa Chileshe', state: 'Failed · wrong number' }, { id: 'P-321', title: 'K3,100 to bank', who: 'Chanda Mulenga', state: 'Processing' }],
  moderation: [{ id: 'M-77', title: 'New artist profile awaiting review', who: 'New applicant', state: 'Review' }],
  support: [{ id: 'S-410', title: 'Can’t change payout method', who: 'Chanda Mulenga', state: 'Open' }],
};
