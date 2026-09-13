import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface Props {
  alignCharacter?: 'center' | 'right';
  companion?: string;
  animationEvent?: string;
  characterClass: string;
  element?: string;
  level?: number;
  interactive?: boolean;
  className?: string;
}

const ARCANE_RUNES = ['✧', '⍙', '⎈', '❖', '⎊', '⍣', '⌖'];


export const getCharacterImage = (charClass: string) => {
  // 3D Cartoon / Stylized figures
  if (charClass === 'Swordsman') return 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80'; // 3D toy knight
  if (charClass === 'Ranger') return 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&q=80'; // Stylized colorful character
  return 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80'; // 3D cartoon avatar
};

export default function ThreeDCharacterDisplay({ characterClass, element, level, companion, interactive = true, alignCharacter = 'center', className }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
    rune: ARCANE_RUNES[Math.floor(Math.random() * ARCANE_RUNES.length)]
  }));

  
  const renderParticles = () => {
    if (characterClass === 'Mage') {
      return particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute text-purple-400 font-mono opacity-80 drop-shadow-[0_0_10px_rgba(192,132,252,1)]"
          style={{ fontSize: p.size * 3, left: `${p.initialX}%`, top: `${p.initialY}%` }}
          animate={{ 
            y: [0, -150, -250], 
            opacity: [0, 1, 0], 
            rotate: [0, 180, 360],
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
        >
          {p.rune}
        </motion.div>
      ));
    }
    if (characterClass === 'Ranger') {
      return particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bg-emerald-500/80 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          style={{ 
            width: p.size * 1.5, 
            height: p.size, 
            left: `${p.initialX}%`, 
            top: `${p.initialY}%`, 
            borderRadius: '50% 0 50% 0' 
          }}
          animate={{ 
            y: [0, -100, -200], 
            x: [0, 50, -50, 0], 
            opacity: [0, 0.9, 0], 
            rotate: [0, 360, 720] 
          }}
          transition={{ duration: p.duration * 0.8, repeat: Infinity, ease: "linear", delay: p.delay }}
        />
      ));
    }
    // Swordsman (Embers)
    return particles.map(p => (
      <motion.div
        key={p.id}
        className="absolute bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,1)]"
        style={{ width: p.size, height: p.size, left: `${p.initialX}%`, top: `${p.initialY}%` }}
        animate={{ 
          y: [0, -200], 
          x: [0, Math.random() * 40 - 20], 
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0]
        }}
        transition={{ duration: p.duration * 0.6, repeat: Infinity, ease: "easeOut", delay: p.delay }}
      />
    ));
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden flex items-center justify-center", className)}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
    >
      {/* Layer 1: Background Environment with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 bg-slate-950"
        animate={{ 
          x: interactive ? mousePosition.x * -30 : 0, 
          y: interactive ? mousePosition.y * -30 : 0, 
          scale: 1.1 
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {characterClass === 'Swordsman' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />}
        {characterClass === 'Mage' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />}
        {characterClass === 'Ranger' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
      </motion.div>

      {/* Layer 2: Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {renderParticles()}
      </div>

      {/* Layer 3: Character Model with Inverse Parallax */}
      <motion.div
        className={cn("relative z-20 w-full max-w-sm aspect-[3/4] flex flex-col items-center justify-center", alignCharacter === 'right' ? 'md:ml-auto md:mr-[10%]' : '')}
        animate={{ 
          x: interactive ? mousePosition.x * 25 : 0, 
          y: interactive ? mousePosition.y * 25 : 0, 
          rotateY: interactive ? mousePosition.x * 10 : 0, 
          rotateX: interactive ? mousePosition.y * -10 : 0 
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
         <motion.div 
            className="absolute inset-0 bg-cover bg-center drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
            initial={{ filter: 'brightness(0)', opacity: 0 }}
            animate={{ filter: 'brightness(1)', opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            style={{
              backgroundImage: `url('${getCharacterImage(characterClass)}')`,
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
            }}
         />
      </motion.div>
      
      
      {/* Layer 5: Companion (If unlocked) */}
      {companion && (
        <motion.div 
          className="absolute z-40 right-10 bottom-10 w-20 h-20 bg-slate-900/80 backdrop-blur rounded-full border border-slate-600 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center"
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-mono text-center text-slate-300 px-2 leading-tight">{companion}</span>
        </motion.div>
      )}

      {/* Layer 4: Foreground Vignette */}
      <div className="absolute inset-0 z-30 shadow-[inset_0_0_120px_rgba(0,0,0,1)] pointer-events-none" />
    </div>
  );
}
