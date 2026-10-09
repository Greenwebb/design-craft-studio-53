import { create } from 'zustand';
import { useAdminOps } from './admin-ops';

// Internal staff accounts, roles and the signed-in admin's own account.
// Preview only: held in memory, no real authentication or permission enforcement.
export const permissionDomains = [
  { id: 'users', label: 'Users', perms: ['view', 'restrict', 'suspend'] },
  { id: 'creators', label: 'Creators', perms: ['view', 'review', 'suspend'] },
  { id: 'orders', label: 'Orders', perms: ['view', 'manage'] },
  { id: 'projects', label: 'Projects', perms: ['view', 'manage'] },
  { id: 'payments', label: 'Payments', perms: ['view'] },
  { id: 'refunds', label: 'Refunds', perms: ['view', 'approve'] },
  { id: 'wallets', label: 'Wallets', perms: ['view', 'adjust'] },
  { id: 'payouts', label: 'Payouts', perms: ['view', 'manage'] },
  { id: 'disputes', label: 'Disputes', perms: ['view', 'resolve'] },
  { id: 'moderation', label: 'Moderation', perms: ['view', 'action'] },
  { id: 'verification', label: 'Verification', perms: ['view', 'approve'] },
  { id: 'support', label: 'Support', perms: ['view', 'manage'] },
  { id: 'collections', label: 'Collections', perms: ['view', 'manage'] },
  { id: 'settings', label: 'Settings', perms: ['view', 'manage'] },
  { id: 'team', label: 'Team', perms: ['view', 'manage'] },
  { id: 'roles', label: 'Roles', perms: ['view', 'manage'] },
  { id: 'audit', label: 'Audit', perms: ['view'] },
] as const;
export const allPermissions = permissionDomains.flatMap((d) => d.perms.map((p) => `${d.id}.${p}`));
const pick = (...domains: string[]) => allPermissions.filter((p) => domains.some((d) => p === d || p.startsWith(`${d}.`)));

export type Role = { id: string; label: string; description: string; permissions: string[]; system: boolean; archived?: boolean };
export type StaffState = 'invited' | 'active' | 'suspended' | 'deactivated';
export type Staff = {
  id: string; name: string; displayName: string; email: string; phone: string; title: string; department: string; roleId: string;
  state: StaffState; joined: string; lastLogin: string; invitedBy: string; invited: string; owns: { support: number; disputes: number; verification: number; moderation: number };
  sessions: Session[];
};
export type Session = { id: string; device: string; place: string; lastActive: string; current?: boolean };
export type Invitation = { id: string; email: string; name: string; roleId: string; department: string; sent: string; state: 'pending' | 'accepted' | 'expired' | 'revoked'; token: string };

const roleSeed: Role[] = [
  { id: 'super', label: 'Super Admin', description: 'Everything, including settings, team and roles.', permissions: [...allPermissions], system: true },
  { id: 'operations', label: 'Operations', description: 'Orders, projects, bookings and disputes. Cannot release payouts.', permissions: [...pick('orders', 'projects', 'disputes', 'support'), 'users.view', 'creators.view', 'payments.view', 'audit.view'], system: true },
  { id: 'support', label: 'Support', description: 'Cases, contacting users and notes.', permissions: [...pick('support'), 'users.view', 'creators.view', 'orders.view', 'projects.view', 'disputes.view'], system: true },
  { id: 'finance', label: 'Finance', description: 'Payments, payouts, wallets and refunds.', permissions: [...pick('payments', 'payouts', 'wallets', 'refunds'), 'orders.view', 'users.view', 'audit.view'], system: true },
  { id: 'moderator', label: 'Moderator', description: 'Content review, hiding works and warnings.', permissions: [...pick('moderation'), 'users.view', 'users.restrict', 'creators.view'], system: true },
  { id: 'curator', label: 'Curator', description: 'Collections and Art for Spaces.', permissions: [...pick('collections'), 'creators.view'], system: true },
  { id: 'verification', label: 'Verification', description: 'Creator identity and payout checks.', permissions: [...pick('verification'), 'creators.view', 'creators.review'], system: true },
];

const s = (id: string, device: string, place: string, lastActive: string, current?: boolean): Session => ({ id, device, place, lastActive, ...(current ? { current } : {}) });
const staffSeed: Staff[] = [
  { id: 'ST-1', name: 'George Mwale', displayName: 'George', email: 'george@iamanartist.co', phone: '+260 97 1000 101', title: 'Operations Administrator', department: 'Operations', roleId: 'super', state: 'active', joined: '3 Jan 2025', lastLogin: 'Today, 07:58', invitedBy: 'Founder', invited: '2 Jan 2025', owns: { support: 4, disputes: 2, verification: 0, moderation: 1 }, sessions: [s('SE-1', 'Chrome · Windows', 'Lusaka', 'Active now', true), s('SE-2', 'Safari · iPhone', 'Lusaka', '2h ago'), s('SE-3', 'Edge · Windows', 'Ndola', '4 days ago')] },
  { id: 'ST-2', name: 'Natasha Phiri', displayName: 'Natasha', email: 'natasha@iamanartist.co', phone: '+260 96 2000 202', title: 'Finance Lead', department: 'Finance', roleId: 'finance', state: 'active', joined: '14 Feb 2025', lastLogin: 'Today, 08:30', invitedBy: 'George Mwale', invited: '12 Feb 2025', owns: { support: 0, disputes: 0, verification: 0, moderation: 0 }, sessions: [s('SE-4', 'Chrome · macOS', 'Lusaka', '10 min ago')] },
  { id: 'ST-3', name: 'Kelvin Zulu', displayName: 'Kelvin', email: 'kelvin@iamanartist.co', phone: '+260 97 3000 303', title: 'Verification Officer', department: 'Trust & Safety', roleId: 'verification', state: 'active', joined: '1 Apr 2025', lastLogin: 'Today, 07:40', invitedBy: 'George Mwale', invited: '30 Mar 2025', owns: { support: 0, disputes: 0, verification: 5, moderation: 0 }, sessions: [s('SE-5', 'Firefox · Ubuntu', 'Kitwe', '1h ago')] },
  { id: 'ST-4', name: 'Chewe Mwila', displayName: 'Chewe', email: 'chewe@iamanartist.co', phone: '', title: 'Curator', department: 'Marketplace', roleId: 'curator', state: 'active', joined: '20 May 2025', lastLogin: 'Yesterday, 18:02', invitedBy: 'George Mwale', invited: '18 May 2025', owns: { support: 0, disputes: 0, verification: 0, moderation: 0 }, sessions: [s('SE-6', 'Safari · iPad', 'Lusaka', 'Yesterday')] },
  { id: 'ST-5', name: 'Mapalo Tembo', displayName: 'Mapalo', email: 'mapalo@iamanartist.co', phone: '+260 95 5000 505', title: 'Content Moderator', department: 'Trust & Safety', roleId: 'moderator', state: 'suspended', joined: '8 Jul 2025', lastLogin: '28 Sep, 16:20', invitedBy: 'George Mwale', invited: '7 Jul 2025', owns: { support: 0, disputes: 0, verification: 0, moderation: 3 }, sessions: [] },
  { id: 'ST-6', name: 'Bwalya Sakala', displayName: 'Bwalya', email: 'bwalya@iamanartist.co', phone: '+260 97 6000 606', title: 'Support Agent', department: 'Support', roleId: 'support', state: 'active', joined: '2 Sep 2025', lastLogin: 'Today, 08:05', invitedBy: 'Natasha Phiri', invited: '1 Sep 2025', owns: { support: 9, disputes: 0, verification: 0, moderation: 0 }, sessions: [s('SE-7', 'Chrome · Android', 'Lusaka', '5 min ago')] },
];
const inviteSeed: Invitation[] = [
  { id: 'IN-12', email: 'lweendo@iamanartist.co', name: 'Lweendo Hamoonga', roleId: 'support', department: 'Support', sent: '7 Oct', state: 'pending', token: 'valid-demo' },
  { id: 'IN-11', email: 'mulenga@iamanartist.co', name: 'Mulenga Bwalya', roleId: 'finance', department: 'Finance', sent: '20 Sep', state: 'expired', token: 'expired-demo' },
];

export type NotifPref = { id: string; label: string; needs: string; inApp: boolean; email: boolean };
type TeamState = {
  meId: string; roles: Role[]; staff: Staff[]; invitations: Invitation[];
  prefs: { landing: string; density: 'comfortable' | 'compact'; timezone: string; dateFormat: string; language: string };
  notifs: NotifPref[];
  updateMe: (patch: Partial<Pick<Staff, 'name' | 'displayName' | 'phone' | 'title'>>) => void;
  setPrefs: (p: Partial<TeamState['prefs']>) => void;
  toggleNotif: (id: string, channel: 'inApp' | 'email') => void;
  signOutSession: (staffId: string, sessionId: string) => void;
  signOutOthers: (staffId: string) => void;
  changeRole: (staffId: string, roleId: string, reason: string) => void;
  setState: (staffId: string, state: StaffState, reason: string) => void;
  invite: (inv: Omit<Invitation, 'id' | 'sent' | 'state' | 'token'>) => void;
  invitation: (id: string, action: 'resend' | 'revoke') => void;
  acceptInvite: (token: string) => boolean;
  saveRole: (role: Role) => void;
  archiveRole: (id: string) => boolean;
};

const log = (action: string, resource: string, id: string, reason?: string) => useAdminOps.getState().log(action, resource, id, reason);

export const useAdminTeam = create<TeamState>()((set, get) => ({
  meId: 'ST-1', roles: structuredClone(roleSeed), staff: structuredClone(staffSeed), invitations: structuredClone(inviteSeed),
  prefs: { landing: '/admin', density: 'comfortable', timezone: 'Africa/Lusaka (UTC+2)', dateFormat: '9 Oct 2026', language: 'English' },
  notifs: [
    { id: 'disputes', label: 'Disputes', needs: 'disputes.view', inApp: true, email: true },
    { id: 'payouts', label: 'Payout failures', needs: 'payouts.view', inApp: true, email: true },
    { id: 'verification', label: 'Verification requests', needs: 'verification.view', inApp: true, email: false },
    { id: 'support', label: 'Support escalations', needs: 'support.view', inApp: true, email: false },
    { id: 'moderation', label: 'Moderation alerts', needs: 'moderation.view', inApp: true, email: false },
    { id: 'payments', label: 'Payment exceptions', needs: 'payments.view', inApp: true, email: true },
    { id: 'system', label: 'System alerts', needs: 'settings.view', inApp: true, email: false },
  ],
  updateMe: (patch) => { set((st) => ({ staff: st.staff.map((x) => (x.id === st.meId ? { ...x, ...patch } : x)) })); log('Profile updated', 'team', get().meId); },
  setPrefs: (p) => set((st) => ({ prefs: { ...st.prefs, ...p } })),
  toggleNotif: (id, channel) => set((st) => ({ notifs: st.notifs.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n)) })),
  signOutSession: (staffId, sessionId) => { set((st) => ({ staff: st.staff.map((x) => (x.id === staffId ? { ...x, sessions: x.sessions.filter((z) => z.id !== sessionId) } : x)) })); log('Session signed out', 'team', staffId); },
  signOutOthers: (staffId) => { set((st) => ({ staff: st.staff.map((x) => (x.id === staffId ? { ...x, sessions: x.sessions.filter((z) => z.current) } : x)) })); log('Signed out all other sessions', 'team', staffId); },
  changeRole: (staffId, roleId, reason) => { set((st) => ({ staff: st.staff.map((x) => (x.id === staffId ? { ...x, roleId } : x)) })); log(`Role changed to ${get().roles.find((r) => r.id === roleId)?.label}`, 'team', staffId, reason); },
  setState: (staffId, state, reason) => {
    set((st) => ({ staff: st.staff.map((x) => (x.id === staffId ? { ...x, state, sessions: state === 'active' ? x.sessions : [], ...(state === 'deactivated' ? { owns: { support: 0, disputes: 0, verification: 0, moderation: 0 } } : {}) } : x)) }));
    log(state === 'active' ? 'Admin access reactivated' : state === 'suspended' ? 'Admin access suspended' : 'Staff deactivated', 'team', staffId, reason);
  },
  invite: (inv) => { const id = `IN-${13 + get().invitations.length}`; set((st) => ({ invitations: [{ ...inv, id, sent: 'Just now', state: 'pending', token: `tok-${id}` }, ...st.invitations] })); log('Invitation sent', 'team', inv.email); },
  invitation: (id, action) => { set((st) => ({ invitations: st.invitations.map((i) => (i.id === id ? { ...i, state: action === 'revoke' ? 'revoked' : 'pending', sent: action === 'resend' ? 'Just now' : i.sent } : i)) })); log(action === 'revoke' ? 'Invitation revoked' : 'Invitation resent', 'team', id); },
  acceptInvite: (token) => {
    const inv = get().invitations.find((i) => i.token === token && i.state === 'pending');
    if (!inv) return false;
    const st: Staff = { id: `ST-${get().staff.length + 1}`, name: inv.name, displayName: inv.name.split(' ')[0] ?? inv.name, email: inv.email, phone: '', title: '', department: inv.department, roleId: inv.roleId, state: 'active', joined: 'Today', lastLogin: 'Just now', invitedBy: 'George Mwale', invited: inv.sent, owns: { support: 0, disputes: 0, verification: 0, moderation: 0 }, sessions: [] };
    set((x) => ({ staff: [...x.staff, st], invitations: x.invitations.map((i) => (i.id === inv.id ? { ...i, state: 'accepted' } : i)) }));
    log('Invitation accepted', 'team', st.id);
    return true;
  },
  saveRole: (role) => { set((st) => ({ roles: st.roles.some((r) => r.id === role.id) ? st.roles.map((r) => (r.id === role.id ? role : r)) : [...st.roles, role] })); log('Role saved', 'roles', role.label); },
  archiveRole: (id) => {
    if (get().staff.some((x) => x.roleId === id && x.state !== 'deactivated')) return false;
    set((st) => ({ roles: st.roles.map((r) => (r.id === id ? { ...r, archived: true } : r)) })); log('Role archived', 'roles', id); return true;
  },
}));

export const roleOf = (roles: Role[], id: string) => roles.find((r) => r.id === id);
export const can = (roles: Role[], roleId: string, perm: string) => !!roleOf(roles, roleId)?.permissions.includes(perm);
