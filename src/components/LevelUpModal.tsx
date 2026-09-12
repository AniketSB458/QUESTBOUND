import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Zap, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EASING, MOTION, SPRING } from '../utils/motion';

export default function LevelUpModal({ data, onClose }: { data: any, onClose: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!data) return;
    
    // Sequence the phases
    const timeouts = [
      setTimeout(() => setPhase(1), 0),       // Phase 1: Dim/Gather Energy
      setTimeout(() => setPhase(2), 250),     // Phase 2: Start Energy
      setTimeout(() => setPhase(3), 650),     // Phase 3: Energy Ring
      setTimeout(() => setPhase(4), 800),     // Phase 4: Level Number
      setTimeout(() => setPhase(5), 1150),    // Phase 5: Number Transformation
      setTimeout(() => setPhase(6), 1600),    // Phase 6: Impact
      setTimeout(() => setPhase(7), 1750),    // Phase 7: Rewards
      setTimeout(() => setPhase(8), 2300),    // Phase 8: Button appears
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [data]);

  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.85)' }}
        exit={{ opacity: 0, transition: { duration: MOTION.medium } }}
        transition={{ duration: MOTION.normal }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-hidden"
      >
        
        {/* Phase 2: Energy Gathering Particles */}
        {phase >= 2 && phase < 6 && (
          <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const radius = 300 + Math.random() * 200;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_10px_#22d3ee]"
                  initial={{ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, opacity: 0 }}
                  animate={{ 
                    x: 0, y: 0, opacity: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: Math.random() * 0.2,
                    ease: EASING.cinematic
                  }}
                />
              );
            })}
          </motion.div>
        )}

        {/* Phase 3: Energy Ring */}
        {phase >= 3 && (
          <motion.div 
            className="absolute w-96 h-96 border-4 border-amber-400 rounded-full pointer-events-none shadow-[0_0_50px_#22d3ee]"
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASING.dramatic }}
          />
        )}

        {/* Phase 6: Impact (Flash + Shake handled locally or globally) */}
        {phase >= 6 && (
          <motion.div 
            className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Phase 6 Impact Glow */}
        {phase >= 6 && (
          <motion.div 
            className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.2)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Main UI Container */}
        <motion.div
          animate={phase >= 6 ? { x: [0, -5, 5, -3, 3, 0], y: [0, 3, -3, 2, -2, 0] } : {}}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg flex flex-col items-center justify-center z-10"
        >
          <div className="flex flex-col items-center text-center">
            
            <motion.div 
              className="w-24 h-24 rounded-full bg-amber-950 border-4 border-amber-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.5)] relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.1 }}
            >
              <ChevronUp size={48} className="text-amber-400" />
            </motion.div>
            
            {phase >= 4 && (
              <motion.h2 
                className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: EASING.enter }}
              >
                LEVEL {phase < 5 ? data.previousLevel : data.newLevel}
              </motion.h2>
            )}

            {/* Level Transform Phase */}
            {phase === 5 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                 {/* Transformation effect goes here, handled in the text above natively for simplicity, but let's pop it */}
              </motion.div>
            )}

            {phase >= 6 && (
              <motion.h2 
                className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] absolute top-[140px]"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1.25, 1], opacity: 1 }}
                transition={SPRING.bouncy}
              >
                LEVEL {data.newLevel}
              </motion.h2>
            )}

            <div className="h-32 mt-6 flex flex-col items-center justify-center space-y-4">
              {phase >= 7 && (
                <>
                  <motion.div 
                    className="flex justify-center items-center text-lg font-mono text-amber-400 font-bold bg-slate-900/80 px-6 py-2 rounded-full border border-amber-500/30"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: EASING.enter }}
                  >
                    <Zap size={18} className="mr-2" /> +{data.rewards?.xp || 0} XP
                  </motion.div>

                  <motion.div 
                    className="flex justify-center items-center text-lg font-mono text-amber-400 font-bold bg-slate-900/80 px-6 py-2 rounded-full border border-amber-500/30"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.12, ease: EASING.enter }}
                  >
                    <Star size={18} className="mr-2" /> +{data.rewards?.credits || 0} CREDITS
                  </motion.div>
                  
                  {data.rewards?.attributeIncrease > 0 && (
                     <motion.div 
                       className="flex justify-center items-center text-lg font-mono text-purple-400 font-bold bg-slate-900/80 px-6 py-2 rounded-full border border-purple-500/30"
                       initial={{ opacity: 0, y: 20, scale: 0.9 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       transition={{ duration: 0.35, delay: 0.24, ease: EASING.enter }}
                     >
                       +{data.rewards?.attributeIncrease || 0} {data.rewards?.attribute?.toUpperCase()}
                     </motion.div>
                  )}
                </>
              )}
            </div>

            {phase >= 8 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING.micro}
                onClick={onClose}
                className="mt-8 bg-amber-500 text-slate-950 font-bold tracking-widest px-10 py-4 rounded-xl font-mono hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              >
                CONTINUE
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
