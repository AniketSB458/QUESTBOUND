import { motion, useAnimation } from 'motion/react';
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../../utils/cn';

interface AnimatedCharacterProps {
  characterClass: string;
  element: string;
  level: number;
  companion?: string;
  interactive?: boolean;
  animationEvent?: 'idle' | 'quest_complete' | 'level_up';
  className?: string;
}

const ELEMENT_COLORS: Record<string, { aura: string; particle: string }> = {
  ARCANE: { aura: 'rgba(168, 85, 247, 0.4)', particle: 'bg-purple-500' },
  SOLAR: { aura: 'rgba(245, 158, 11, 0.4)', particle: 'bg-amber-500' },
  VOID: { aura: 'rgba(30, 27, 75, 0.6)', particle: 'bg-indigo-900' },
  STORM: { aura: 'rgba(14, 165, 233, 0.4)', particle: 'bg-sky-400' },
  NATURE: { aura: 'rgba(34, 197, 94, 0.4)', particle: 'bg-emerald-400' },
  FROST: { aura: 'rgba(56, 189, 248, 0.4)', particle: 'bg-blue-300' },
  DEFAULT: { aura: 'rgba(251, 191, 36, 0.4)', particle: 'bg-amber-400' }
};

export default function ThreeDCharacterDisplay({ 
  characterClass, 
  element, 
  level, 
  companion,
  interactive = true,
  animationEvent = 'idle',
  className 
}: AnimatedCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  
  const elementTheme = ELEMENT_COLORS[element] || ELEMENT_COLORS.DEFAULT;
  const isMobile = window.innerWidth < 768;

  // Since actual transparent webm/webp assets require user upload, 
  // we simulate the "premium animated image" feel using layered css, 
  // masking, and sophisticated placeholder structures.
  
const getCharacterImage = (charClass: string, level: number) => {
  if (charClass === 'Swordsman') {
    return 'https://images.unsplash.com/photo-1535581174620-3b03698b6883?auto=format&fit=crop&q=80'; // Armored Knight
  }
  
  if (charClass === 'Ranger') {
    return 'https://images.unsplash.com/photo-1598153346810-860daa814ce9?auto=format&fit=crop&q=80'; // Hooded figure / Hunter
  }
  
  // Mage fallback
  return 'https://images.unsplash.com/photo-1514838612111-e633d7dfd1dd?auto=format&fit=crop&q=80'; // Mystical glowing orb/figure
};


  const getParticleStyle = () => {
    if (characterClass === 'Swordsman') return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'; // Embers
    if (characterClass === 'Ranger') return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] rounded-sm rotate-45'; // Leaves/wind
    if (characterClass === 'Mage') return 'bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.9)]'; // Arcane energy
    return elementTheme.particle;
  };

  const getAuraColor = () => {
    if (characterClass === 'Swordsman') return 'rgba(245, 158, 11, 0.4)'; // Warm golden/amber
    if (characterClass === 'Ranger') return 'rgba(16, 185, 129, 0.3)'; // Earth green
    if (characterClass === 'Mage') return 'rgba(139, 92, 246, 0.4)'; // Mystical purple/blue
    return elementTheme.aura;
  };

  const getCharacterAsset = () => {
    // In a real app, this would point to '/assets/characters/swordsman/idle.webm'
    // For now, we use high-quality class-themed gradients and masks to represent the character silhouette.
    return characterClass; 
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    if (animationEvent === 'level_up') {
      controls.start({
        scale: [1, 1.2, 1],
        filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'],
        transition: { duration: 1.5, ease: "easeOut" }
      }).then(() => {
        controls.start({
          y: [0, -8, 0],
          scaleY: [1, 1.02, 1],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        });
      });
    } else if (animationEvent === 'quest_complete') {
      controls.start({
        scale: [1, 1.05, 1],
        filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
        transition: { duration: 0.5, ease: "easeOut" }
      }).then(() => {
        controls.start({
          y: [0, -8, 0],
          scaleY: [1, 1.02, 1],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        });
      });
    } else {
      controls.start({
        y: [0, -8, 0],
        scaleY: [1, 1.02, 1],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      });
    }
  }, [controls, animationEvent]);

  // Generate particles based on element
  const particles = Array.from({ length: isMobile ? 12 : 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5
  }));

  const getSilhouette = () => {
    switch(characterClass) {
      case 'Swordsman': return 'clip-path-swordsman';
      case 'Mage': return 'clip-path-mage';
      case 'Ranger': return 'clip-path-ranger';
      default: return 'clip-path-swordsman';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden flex items-center justify-center group", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      {/* 1. BACKGROUND ENVIRONMENT (Parallax) */}
      <motion.div 
        className="absolute inset-0 bg-slate-950 opacity-80"
        animate={{
          x: interactive ? mousePosition.x * -20 : 0,
          y: interactive ? mousePosition.y * -20 : 0,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black opacity-60" />
        
                {/* Environment based on class */}
        {characterClass === 'Swordsman' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />} {/* Fortress */}
        {characterClass === 'Mage' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530983818320-9430c6fa0995?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />} {/* Ruins */}
        {characterClass === 'Ranger' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-882707db8855?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />} {/* Forest */}
      </motion.div>

      {/* 2. ATMOSPHERE / FOG */}
      <div 
        className="absolute inset-0 blur-3xl pointer-events-none transition-all duration-1000"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${getAuraColor()}, transparent 70%)`,
          opacity: isHovered ? 0.8 : 0.4,
          transform: `scale(${isHovered ? 1.1 : 1})`
        }}
      />

      {/* 3. PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={cn("absolute", getParticleStyle())}
            style={{ 
              width: p.size, 
              height: p.size,
              left: `${p.initialX}%`,
              top: `${p.initialY}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: interactive ? mousePosition.x * 50 : 0,
              opacity: [0, 0.8, 0]
            }}
            transition={{
              y: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
              opacity: { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay },
              x: { type: "spring", stiffness: 50 }
            }}
          />
        ))}
      </div>

            {/* 4. MAIN CHARACTER */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0, filter: 'brightness(0)' }}
        whileInView={{ opacity: 1, filter: 'brightness(1)' }}
        viewport={{ once: true }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
        style={{
          transform: interactive ? `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)` : 'none',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Character Image Asset */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ 
              backgroundImage: `url('${getCharacterImage(characterClass, level)}')`,
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
            }}
          />
          
          {/* Glowing Equipment Accents based on Element */}
          <motion.div 
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-1/2 h-1/3 blur-3xl mix-blend-screen pointer-events-none"
            style={{ backgroundColor: elementTheme.aura }}
            animate={{ opacity: isHovered ? 0.8 : 0.4, scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* 5. COMPANION (If unlocked) */}
        {companion && (
          <motion.div 
            className="absolute -right-4 bottom-4 w-16 h-16 bg-slate-800/80 backdrop-blur rounded-full border border-slate-600 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center z-20"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <span className="text-[10px] font-mono text-center text-slate-300 px-2">{companion}</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* 6. FRONT VIGNETTE */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] pointer-events-none z-30" />
    </div>
  );
}
