import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateQuestRewards, getXPProgress, getXPRequiredForLevel, mapCategoryToAttribute } from './rpgLogic';

describe('RPG progression', () => {
  it('requires progressively more XP for every level', () => {
    for (let level = 1; level < 50; level += 1) assert.ok(getXPRequiredForLevel(level + 1) > getXPRequiredForLevel(level));
  });
  it('uses the documented first thresholds', () => {
    assert.equal(getXPRequiredForLevel(1), 100);
    assert.equal(getXPRequiredForLevel(2), 282);
  });
  it('orders rewards by difficulty', () => {
    const rewards = ['Easy', 'Medium', 'Hard', 'Epic'].map(calculateQuestRewards);
    for (let index = 1; index < rewards.length; index += 1) {
      assert.ok(rewards[index].xp > rewards[index - 1].xp);
      assert.ok(rewards[index].credits > rewards[index - 1].credits);
    }
  });
  it('maps categories to attributes', () => {
    assert.equal(mapCategoryToAttribute('Coding'), 'intellect');
    assert.equal(mapCategoryToAttribute('Fitness'), 'strength');
    assert.equal(mapCategoryToAttribute('Personal'), 'discipline');
  });
  it('clamps XP progress', () => {
    assert.equal(getXPProgress(0, 1).percentage, 0);
    assert.equal(getXPProgress(999999, 1).percentage, 100);
  });
});
