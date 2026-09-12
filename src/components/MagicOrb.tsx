import { motion } from 'motion/react';
import { cn } from '../utils/cn';

export default function MagicOrb({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-32 h-32 flex items-center justify-center", className)}>
      <motion.div 
        className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.8)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 rounded-full border border-amber-400/30 shadow-[inset_0_0_20px_rgba(251,191,36,0.5)]" />
    </div>
  );
}
