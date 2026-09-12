export interface Traits {
  intellect: number;
  courage: number;
  discipline: number;
  creativity: number;
  empathy: number;
  energy: number;
}

export const calculateCharacterProfile = (traits: Traits) => {
  // Find primary trait
  let maxTrait = 'intellect';
  let maxVal = 0;
  
  Object.entries(traits).forEach(([trait, val]) => {
    if (val > maxVal) {
      maxVal = val;
      maxTrait = trait;
    }
  });

  let identity = "THE SEEKER";
  let characterClass = "Swordsman";
  let element = "Arcane";
  let companion = "LUMI The Starlit Fox";
  let specialAbility = "FOCUS";

  // Identity logic
  if (maxTrait === 'intellect') {
    identity = "THE STRATEGIST";
    characterClass = "Mage";
    specialAbility = "FORESIGHT";
    companion = "AEGIS The Spectral Owl";
  } else if (maxTrait === 'courage') {
    identity = "THE VANGUARD";
    characterClass = "Swordsman";
    specialAbility = "IRON WILL";
    companion = "IGNIS The Ember Wolf";
  } else if (maxTrait === 'discipline') {
    identity = "THE WARDEN";
    characterClass = "Swordsman";
    specialAbility = "FOCUS";
    companion = "TERRA The Stone Bear";
  } else if (maxTrait === 'creativity') {
    identity = "THE ARCHITECT";
    characterClass = "Mage";
    specialAbility = "OVERCHARGE";
    companion = "LUMI The Starlit Fox";
  } else if (maxTrait === 'empathy') {
    identity = "THE WAYFINDER";
    characterClass = "Ranger";
    specialAbility = "QUICKSTEP";
    companion = "AURA The Wind Sprite";
  } else if (maxTrait === 'energy') {
    identity = "THE TACTICIAN";
    characterClass = "Ranger";
    specialAbility = "MOMENTUM";
    companion = "VOLT The Spark Hawk";
  }

  // Element logic
  const elements = ["ARCANE", "SOLAR", "VOID", "STORM", "NATURE", "FROST"];
  if (traits.energy > traits.discipline) element = "STORM";
  else if (traits.courage > traits.empathy) element = "SOLAR";
  else if (traits.creativity > traits.intellect) element = "ARCANE";
  else if (traits.empathy > traits.energy) element = "NATURE";
  else if (traits.discipline > traits.creativity) element = "FROST";
  else element = "VOID";

  // Base attributes mapping (scaling the score down to a small starting boost)
  const baseAttributes = {
    strength: 1 + Math.floor(traits.courage * 0.5) + Math.floor(traits.energy * 0.2),
    intellect: 1 + Math.floor(traits.intellect * 0.5) + Math.floor(traits.creativity * 0.2),
    discipline: 1 + Math.floor(traits.discipline * 0.6),
    creativity: 1 + Math.floor(traits.creativity * 0.5) + Math.floor(traits.empathy * 0.2),
    energy: 1 + Math.floor(traits.energy * 0.6),
    empathy: 1 + Math.floor(traits.empathy * 0.6),
  };

  return {
    identity,
    characterClass,
    element,
    companion,
    specialAbility,
    primaryAttribute: maxTrait.toUpperCase(),
    traits,
    baseAttributes
  };
};
