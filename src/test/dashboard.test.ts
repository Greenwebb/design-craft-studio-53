import { describe, expect, it } from 'vitest';
import { getStudio, navigation, createOptions, previewStates } from '@/data/dashboard';
describe('Creative studio capabilities', () => {
 for (const state of previewStates) it(`adapts navigation for ${state}`, () => {
  const studio = getStudio(state);
  const ids = navigation(studio.capabilities).map(n=>n.id);
  expect(ids.includes('sell')).toBe(studio.capabilities.sellsWorks);
  expect(ids.includes('services')).toBe(studio.capabilities.offersServices);
  expect(ids.includes('earnings')).toBe(studio.monetizationEnabled);
  expect(createOptions(studio.capabilities).some(o=>o.section==='sell')).toBe(studio.capabilities.sellsWorks);
 });
 it('gives new artists a useful next action without empty commerce', () => {
  const studio=getStudio('new');
  expect(studio.data.earnings).toBeUndefined();
  expect(studio.data.attention).toEqual([]);
  expect(studio.data.recentWork).toEqual([]);
  expect(studio.data.recommendedNextAction.href).toBe('portfolio');
 });
 it('shows an earnings opportunity before a dancer earns',()=>{
  expect(getStudio('dancer').data.earnings?.available).toBe(0);
 });
});