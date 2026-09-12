export const BASE_XP = 100;
export const XP_MULTIPLIER = 1.5;

export const getXPRequiredForLevel = (level: number): number => {
  return Math.floor(BASE_XP * Math.pow(level, XP_MULTIPLIER));
};

export const getXPProgress = (xp: number, level: number) => {
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

export const difficultyColors: Record<string, string> = {
  Easy: 'text-green-400 border-green-400/30 bg-green-400/10',
  Medium: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Hard: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Epic: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
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
