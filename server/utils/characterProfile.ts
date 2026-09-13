export type CharacterTraits = {
  intellect: number;
  courage: number;
  discipline: number;
  creativity: number;
  empathy: number;
  energy: number;
};

export const calculateCharacterProfile = (traits: CharacterTraits) => {
  const primary = Object.entries(traits).reduce((best, current) => current[1] > best[1] ? current : best, ['intellect', -1] as [string, number])[0];
  const profiles: Record<string, { identity: string; characterClass: string; specialAbility: string; companion: string }> = {
    intellect: { identity: 'THE STRATEGIST', characterClass: 'Mage', specialAbility: 'FORESIGHT', companion: 'AEGIS The Spectral Owl' },
    courage: { identity: 'THE VANGUARD', characterClass: 'Swordsman', specialAbility: 'IRON WILL', companion: 'IGNIS The Ember Wolf' },
    discipline: { identity: 'THE WARDEN', characterClass: 'Swordsman', specialAbility: 'FOCUS', companion: 'TERRA The Stone Bear' },
    creativity: { identity: 'THE ARCHITECT', characterClass: 'Mage', specialAbility: 'OVERCHARGE', companion: 'LUMI The Starlit Fox' },
    empathy: { identity: 'THE WAYFINDER', characterClass: 'Ranger', specialAbility: 'QUICKSTEP', companion: 'AURA The Wind Sprite' },
    energy: { identity: 'THE TACTICIAN', characterClass: 'Ranger', specialAbility: 'MOMENTUM', companion: 'VOLT The Spark Hawk' },
  };
  const element = traits.energy > traits.discipline ? 'STORM'
    : traits.courage > traits.empathy ? 'SOLAR'
    : traits.creativity > traits.intellect ? 'ARCANE'
    : traits.empathy > traits.energy ? 'NATURE'
    : traits.discipline > traits.creativity ? 'FROST' : 'VOID';
  return {
    ...profiles[primary],
    element,
    baseAttributes: {
      strength: 1 + Math.floor(traits.courage * 0.5) + Math.floor(traits.energy * 0.2),
      intellect: 1 + Math.floor(traits.intellect * 0.5) + Math.floor(traits.creativity * 0.2),
      discipline: 1 + Math.floor(traits.discipline * 0.6),
      creativity: 1 + Math.floor(traits.creativity * 0.5) + Math.floor(traits.empathy * 0.2),
      energy: 1 + Math.floor(traits.energy * 0.6),
      empathy: 1 + Math.floor(traits.empathy * 0.6),
    },
  };
};
