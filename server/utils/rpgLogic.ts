// Constants for RPG Formulas
export const BASE_XP = 100;
export const XP_MULTIPLIER = 1.5;

export const getXPRequiredForLevel = (level: number): number => {
  return Math.floor(BASE_XP * Math.pow(level, XP_MULTIPLIER));
};

export const getCurrentLevelFromXP = (xp: number): number => {
  let level = 1;
  while (xp >= getXPRequiredForLevel(level)) {
    level++;
  }
  return level;
};

export const getXPProgress = (xp: number, level: number) => {
  const xpForCurrentLevel = getXPRequiredForLevel(level - 1); // total XP needed to REACH current level
  const xpForNextLevel = getXPRequiredForLevel(level); // total XP needed to REACH next level
  
  // Wait, if xp = 0, level 1, required for level 1 is 100.
  // Actually, standard formula: 
  // level 1: 0 to 100 XP
  // level 2: 100 to 282 XP (if level 2 is 100*2^1.5 = 282)
  // Let's redefine:
  // XP required for NEXT level (from 0 to next): 100 * level^1.5
  
  const base = level === 1 ? 0 : getXPRequiredForLevel(level - 1);
  const next = getXPRequiredForLevel(level);
  
  const currentLevelProgress = xp - base;
  const xpNeededForNext = next - base;
  
  return {
    currentLevelProgress,
    xpNeededForNext,
    percentage: Math.min(100, Math.max(0, (currentLevelProgress / xpNeededForNext) * 100))
  };
};

export const calculateQuestRewards = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return { xp: 50, credits: 20, attribute: 2 };
    case 'Medium': return { xp: 120, credits: 40, attribute: 5 };
    case 'Hard': return { xp: 300, credits: 75, attribute: 10 };
    case 'Epic': return { xp: 750, credits: 150, attribute: 25 };
    default: return { xp: 50, credits: 20, attribute: 2 };
  }
};

export const mapCategoryToAttribute = (category: string) => {
  const map: Record<string, string> = {
    Coding: 'intellect',
    Study: 'intellect',
    Fitness: 'strength',
    Empathy: 'empathy',
    Reading: 'intellect',
    Creativity: 'creativity',
    Personal: 'discipline',
    Other: 'energy'
  };
  return map[category] || 'energy';
};
