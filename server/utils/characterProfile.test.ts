import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateCharacterProfile } from './characterProfile';

describe('character profile', () => {
  it('derives identity and bounded starting attributes from traits', () => {
    const profile = calculateCharacterProfile({ intellect: 15, courage: 0, discipline: 5, creativity: 3, empathy: 2, energy: 0 });
    assert.equal(profile.characterClass, 'Mage');
    assert.equal(profile.identity, 'THE STRATEGIST');
    assert.ok(Object.values(profile.baseAttributes).every((value) => value >= 1 && value <= 12));
  });
});
