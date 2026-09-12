import { motion } from 'motion/react';
import { ChevronUp, Zap, Star } from 'lucide-react';

export default function LevelUpModal({ data, onClose }: { data: any, onClose: () => void }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="relative w-full max-w-lg bg-neutral-900 border-2 border-cyan-400 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.3)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
        
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-cyan-950 border-4 border-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          >
            <ChevronUp size={48} className="text-cyan-400" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            LEVEL UP
          </h2>
          
          <div className="flex items-center gap-4 my-6">
            <span className="text-3xl text-neutral-500 font-mono">{data.previousLevel}</span>
            <div className="w-12 h-px bg-cyan-500/50" />
            <span className="text-5xl text-cyan-400 font-bold font-mono drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">{data.newLevel}</span>
          </div>
          
          <div className="w-full bg-neutral-950 rounded-xl p-6 border border-neutral-800 mb-8 mt-2 space-y-3">
             <div className="flex justify-between items-center text-sm font-mono">
               <span className="text-neutral-400">XP EARNED</span>
               <span className="text-cyan-400 font-bold flex items-center gap-2"><Zap size={14}/> +{data.rewards?.xp || 0}</span>
             </div>
             <div className="flex justify-between items-center text-sm font-mono">
               <span className="text-neutral-400">CREDITS OBTAINED</span>
               <span className="text-amber-400 font-bold flex items-center gap-2"><Star size={14}/> +{data.rewards?.credits || 0}</span>
             </div>
             <div className="flex justify-between items-center text-sm font-mono">
               <span className="text-neutral-400">ATTRIBUTE INC ({data.rewards?.attribute?.toUpperCase()})</span>
               <span className="text-purple-400 font-bold">+{data.rewards?.attributeIncrease || 0}</span>
             </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-cyan-500 text-neutral-950 font-bold tracking-widest px-6 py-4 rounded-xl font-mono hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            CONTINUE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
