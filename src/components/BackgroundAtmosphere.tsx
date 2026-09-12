import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function BackgroundAtmosphere() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate 30 background particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random start horizontal position (%)
      y: Math.random() * 100, // random start vertical position (%)
      duration: 8 + Math.random() * 10, // 8 - 18 seconds duration
      delay: Math.random() * -20, // Start at different times (negative delay for pre-warmed state)
      size: 1 + Math.random() * 2, // 1 - 3px size
      opacity: 0.1 + Math.random() * 0.35, // 0.1 - 0.45 opacity
      xMove: (Math.random() - 0.5) * 50, // random ±25px movement
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
      {/* Ambient glow pulse */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.12)_0%,rgba(2,6,23,1)_70%)]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-400"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            width: p.size, 
            height: p.size, 
            opacity: p.opacity 
          }}
          animate={{
            y: [0, -40],
            x: [0, p.xMove],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
