import { describe,it,expect } from 'vitest';
import { previewUser,sharedProjects,sharedConversations,contextNotifications } from '@/data/ecosystem';
import { navigation,getStudio } from '@/data/dashboard';
describe('Three-shell presentation model',()=>{
 it('uses one identity for an artist who collects',()=>{const u=previewUser('artist-collector');expect(u.roles).toEqual(['customer','creator']);expect(u.creatorProfile).toBeDefined();expect(u.customerProfile).toBeDefined();});
 it('keeps customers out of creator navigation',()=>{expect(previewUser('customer').roles).not.toContain('creator');});
 it('reuses the project record in contextual conversations',()=>{expect(sharedConversations[0]?.projectId).toBe(sharedProjects[0]?.id);});
 it('separates buying and creating notifications',()=>{expect(contextNotifications.filter(n=>n.context==='customer')).toHaveLength(1);});
 it('does not force musicians or portfolio artists to sell',()=>{expect(navigation(getStudio('musician').capabilities).some(n=>n.id==='sell')).toBe(false);expect(navigation(getStudio('portfolio').capabilities).some(n=>n.id==='earnings')).toBe(false);});
});
