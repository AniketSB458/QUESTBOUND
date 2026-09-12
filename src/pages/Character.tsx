import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Shield, Brain, Dumbbell, Lightbulb, Heart, Target, Activity, RefreshCw, Zap } from 'lucide-react';
import { getXPProgress } from '../utils/rpgLogic';
import { motion, AnimatePresence } from 'motion/react';
import MagicOrb from '../components/MagicOrb';
import { getCharacterDetails } from '../utils/character';
import { useState } from 'react';

const StatBox = ({ label, value, icon: Icon, colorClass }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg bg-slate-950 border flex items-center justify-center ${colorClass.replace('text-', 'border-').replace('400', '400/30')}`}>
      <Icon className={colorClass} size={24} />
    </div>
    <div>
      <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">{label.toUpperCase()}</div>
      <div className="text-xl font-bold text-white font-mono">{value}</div>
    </div>
  </div>
);

export default function Character() {
  const { user, updateUser } = useAuth();
  const [showRediscover, setShowRediscover] = useState(false);
  
  if (!user) return null;

  const { currentLevelProgress, xpNeededForNext, percentage } = getXPProgress(user.xp, user.level);
  
  const characterDetails = getCharacterDetails(user.characterClass || 'Unassigned', user.level);
  
  const attributes = user.attributes || {
    strength: 1, intellect: 1, discipline: 1, creativity: 1, energy: 1, empathy: 1
  };

  const inventoryCount = (user.inventory?.length || 0) + (user.badges?.length || 0);

  const handleRediscover = () => {
    updateUser({ quizCompleted: false });
    setShowRediscover(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white font-mono uppercase flex items-center gap-3">
            <UserIcon className="text-amber-400" />
            CHARACTER SHEET
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-1">Detailed statistics and progression.</p>
        </div>
        
        {user.identity && (
          <button 
            onClick={() => setShowRediscover(true)}
            className="self-start md:self-auto px-4 py-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 font-mono text-sm tracking-widest rounded-lg flex items-center gap-2 transition-all"
          >
            <RefreshCw size={16} /> REDISCOVER
          </button>
        )}
      </div>

      <AnimatePresence>
        {showRediscover && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(251,191,36,0.1)] text-center relative overflow-hidden"
            >
              <div className="text-xs font-mono tracking-[0.2em] text-slate-500 mb-2">CURRENT IDENTITY</div>
              <div className="text-2xl font-bold font-mono tracking-widest text-amber-400 mb-6">{user.identity}</div>
              
              <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                Your character identity will be recalculated through the discovery process. Your stats, level, inventory, and quest history will NOT be lost.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRediscover(false)}
                  className="flex-1 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-sm tracking-widest rounded-xl transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleRediscover}
                  className="flex-1 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 font-mono text-sm tracking-widest font-bold rounded-xl transition-colors"
                >
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
           <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-slate-950/40 border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)] shrink-0 relative z-20 overflow-hidden flex items-center justify-center">
             {user.characterClass && user.characterClass !== 'Unassigned' ? (
               <img src={characterDetails.avatarUrl} alt={characterDetails.title} className="w-full h-full object-cover opacity-90 scale-125" />
             ) : (
               <MagicOrb />
             )}
           </div>
           
           <div className="flex-1 w-full text-center md:text-left">
             <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2 justify-center md:justify-start">
               <h2 className="text-3xl font-bold text-white tracking-widest">{user.name.toUpperCase()}</h2>
             </div>
             
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
               {user.identity && (
                 <span className="text-amber-400 font-bold font-mono tracking-widest uppercase">{user.identity}</span>
               )}
               {user.identity && <span className="text-slate-600 hidden md:inline">•</span>}
               <span className="text-slate-300 font-mono tracking-widest uppercase">{characterDetails.title}</span>
               {user.element && (
                 <>
                   <span className="text-slate-600 hidden md:inline">•</span>
                   <span className="px-2 py-0.5 bg-amber-900/20 border border-amber-500/30 text-amber-500/80 rounded text-[10px] font-mono tracking-widest">{user.element}</span>
                 </>
               )}
             </div>

             {user.companion && (
               <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-900/10 rounded-lg text-emerald-400 font-mono text-xs tracking-widest">
                 COMPANION: {user.companion}
               </div>
             )}
             
             <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 w-full">
               <div className="flex justify-between items-end mb-2">
                 <div className="text-xs font-mono text-slate-400 tracking-widest">PROGRESSION TO LVL {user.level + 1}</div>
                 <div className="text-sm font-bold font-mono text-amber-400">{percentage.toFixed(1)}%</div>
               </div>
               
               <div className="h-2 bg-slate-900 rounded-full overflow-hidden mb-3 relative">
                 <motion.div 
                   className="h-full bg-amber-400 relative overflow-hidden"
                   initial={{ width: 0 }}
                   animate={{ width: `${percentage}%` }}
                   transition={{ type: "spring", bounce: 0.25, duration: 1.5 }}
                 >
                   <motion.div 
                     className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                     initial={{ x: '-100%' }}
                     animate={{ x: '100%' }}
                     transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   />
                 </motion.div>
               </div>
               
               <div className="flex justify-between text-xs font-mono text-slate-500">
                 <span>{user.xp} TOTAL XP</span>
                 <span>{currentLevelProgress} / {xpNeededForNext} XP TO NEXT LEVEL</span>
               </div>
             </div>
           </div>
        </div>
        
        {user.specialAbility && (
          <div className="mb-10 bg-purple-900/10 border border-purple-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
              <Zap className="text-purple-400" size={24} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-purple-400/70 tracking-widest mb-1">SPECIAL ABILITY AWAKENED</div>
              <div className="text-xl font-bold font-mono text-purple-400 tracking-widest mb-2">{user.specialAbility}</div>
              <p className="text-sm text-slate-400">This ability is a manifestation of your deepest traits and influences your interactions within Questbound.</p>
            </div>
          </div>
        )}

        <h3 className="text-lg font-bold tracking-widest text-slate-300 font-mono mb-6 uppercase border-b border-slate-800 pb-2">
          Combat Stats & Attributes
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           <StatBox label="Intellect" value={attributes.intellect} icon={Brain} colorClass="text-blue-400" />
           <StatBox label="Strength" value={attributes.strength} icon={Dumbbell} colorClass="text-red-400" />
           <StatBox label="Discipline" value={attributes.discipline} icon={Shield} colorClass="text-emerald-400" />
           <StatBox label="Creativity" value={attributes.creativity} icon={Lightbulb} colorClass="text-purple-400" />
           <StatBox label="Energy" value={attributes.energy} icon={Activity} colorClass="text-orange-400" />
           <StatBox label="Empathy" value={attributes.empathy} icon={Heart} colorClass="text-pink-400" />
        </div>
        
        <h3 className="text-lg font-bold tracking-widest text-slate-300 font-mono mt-10 mb-6 uppercase border-b border-slate-800 pb-2">
          Achievement Metrics
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-slate-400 tracking-widest">CURRENT STREAK</div>
             <div className="text-2xl font-bold text-orange-500 font-mono">{user.streak} DAYS</div>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-slate-400 tracking-widest">LONGEST STREAK</div>
             <div className="text-2xl font-bold text-orange-400/70 font-mono">{user.longestStreak} DAYS</div>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-slate-400 tracking-widest">GALLEONS</div>
             <div className="text-2xl font-bold text-amber-400 font-mono">{user.credits} CR</div>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-slate-400 tracking-widest">ITEMS ACQUIRED</div>
             <div className="text-2xl font-bold text-amber-400 font-mono">{inventoryCount}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
