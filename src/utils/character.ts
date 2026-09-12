export const getCharacterDetails = (characterClass: string, level: number) => {
  let tier = 1;
  let titlePrefix = 'Novice';

  if (level >= 10) {
    tier = 3;
    titlePrefix = 'Master';
  } else if (level >= 5) {
    tier = 2;
    titlePrefix = 'Adept';
  }

  // Use Dicebear Adventurer for immediate character images.
  // The seed is a combination of class and tier to give a consistent, progressing look.
  let seed = `${characterClass}-${tier}`;
  
  // Custom tweaks for better styling based on class
  let avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=transparent`;

  return {
    title: `${titlePrefix} ${characterClass === 'Unassigned' ? 'Student' : characterClass}`,
    tier,
    avatarUrl
  };
};
