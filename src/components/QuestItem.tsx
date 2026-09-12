import { motion, AnimatePresence } from 'motion/react';
import { EASING, MOTION, SPRING } from '../utils/motion';
import { cn } from '../utils/cn';
import { TrendingUp, Award, CheckCircle, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const difficultyColors: Record<string, string> = {
  Easy: 'text-green-400 border-green-400/30 bg-green-400/10',
  Medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Hard: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  Epic: 'text-purple-400 border-purple-400/30 bg-purple-400/10'
};

export const QuestItem = ({ quest, onComplete, onDelete }: any) => {
  const [phase, setPhase] = useState(0); // 0: Idle, 1: Press, 2: Release/Energy, 3: Checkmark, 4: Burst, 5: XP, 6: Credits, 7: Attr, 8: Done
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isCompleting = useRef(false);
  
  const handleCompleteSequence = () => {
    if (phase > 0 || isCompleting.current) return;
    isCompleting.current = true;
    
    // Timeline sequence (optimistic visual before callback)
    setPhase(1); // 0-100ms
    setTimeout(() => setPhase(2), 100); // 100-250ms (Release + Quest Energy)
    setTimeout(() => setPhase(3), 300); // 300-600ms (Checkmark)
    setTimeout(() => setPhase(4), 350); // 350-750ms (Particle Burst)
    setTimeout(() => setPhase(5), 450); // 450-950ms (XP pop)
    setTimeout(() => setPhase(6), 650); // 650-1050ms (Credits)
    setTimeout(() => setPhase(7), 750); // 750-1200ms (Attr pop)
    
    setTimeout(() => {
      setPhase(8);
      onComplete(quest._id);
    }, 1400); // Trigger actual API call and state removal
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ 
        opacity: 1, 
        y: hovered && phase === 0 ? -5 : 0, 
        scale: phase === 1 ? 0.94 : (phase === 2 ? 1.025 : (hovered && phase === 0 ? 1.015 : 1)),
        boxShadow: hovered && phase === 0 ? '0 0 20px rgba(251,191,36,0.1)' : (phase === 2 ? '0 0 40px rgba(251,191,36,0.3)' : 'none')
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: phase === 1 ? 0.1 : (phase === 2 ? 0.25 : 0.22),
        ease: phase === 1 ? "easeOut" : EASING.smooth 
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group overflow-hidden"
    >
      {/* Light Sweep Effect on Hover */}
      <motion.div 
        className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-amber-400/10 to-transparent skew-x-[-20deg] pointer-events-none"
        initial={{ x: '-150%' }}
        animate={hovered ? { x: '250%' } : { x: '-150%' }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      
      {/* Card Glow during completion phase */}
      {phase >= 2 && (
         <motion.div 
           className="absolute inset-0 bg-amber-400/5 pointer-events-none"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
         />
      )}

      {/* Reward Popups (Absolute over card) */}
      <AnimatePresence>
        {phase >= 5 && phase < 8 && (
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400 font-bold font-mono text-xl z-20 whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: [0.5, 1.15, 1], y: -35 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: EASING.enter }}
          >
            +{quest.xpReward} XP
          </motion.div>
        )}
        {phase >= 6 && phase < 8 && (
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400 font-bold font-mono text-lg z-20 whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: [0.7, 1, 0.95], y: -5 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4, ease: EASING.enter }}
          >
            +{quest.creditReward} CR
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn("text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded border", difficultyColors[quest.difficulty])}>
            {quest.difficulty.toUpperCase()}
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50">
            {quest.category.toUpperCase()}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">{quest.title}</h3>
        
        <div className="flex gap-4 text-xs font-mono mt-3">
          <span className="text-amber-400 flex items-center gap-1"><TrendingUp size={14}/> {quest.xpReward} XP</span>
          <span className="text-amber-400 flex items-center gap-1"><Award size={14}/> {quest.creditReward} CR</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        {phase === 0 && (
          <button
            onClick={() => onDelete(quest._id)}
            className="p-2 sm:p-3 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Abort Mission"
          >
            <X size={20} />
          </button>
        )}
        
        <motion.button
          onClick={handleCompleteSequence}
          disabled={phase > 0}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.94 }}
          transition={SPRING.micro}
          className={cn(
            "flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-mono tracking-widest font-bold flex items-center justify-center gap-2 transition-colors relative overflow-hidden",
            phase > 0 
              ? "bg-green-500/20 text-green-300 border border-green-400/50" 
              : "bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          )}
        >
          {phase >= 3 ? (
             <motion.div
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 0.3, ease: EASING.enter }}
             >
               <CheckCircle size={18} />
             </motion.div>
          ) : (
            <>
              <CheckCircle size={18} />
              <span className="hidden sm:inline">COMPLETE</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
