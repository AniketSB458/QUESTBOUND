import { Sword, Crosshair, Sparkles } from 'lucide-react';

export default function ClassSymbol({ characterClass, className, size = 16 }: { characterClass: string, className?: string, size?: number }) {
  if (characterClass === 'Swordsman') {
    return <Sword size={size} className={className} />;
  }
  if (characterClass === 'Ranger') {
    return <Crosshair size={size} className={className} />;
  }
  if (characterClass === 'Mage') {
    return <Sparkles size={size} className={className} />;
  }
  return null;
}
