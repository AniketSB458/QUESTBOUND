import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Shield, Brain, Dumbbell, Lightbulb, Heart, Target, Activity } from 'lucide-react';
import { getXPProgress } from '../utils/rpgLogic';
import { motion } from 'motion/react';
import MagicOrb from '../components/MagicOrb';

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
  const { user } = useAuth();

  if (!user) return null;

  const { currentLevelProgress, xpNeededForNext, percentage } = getXPProgress(user.xp, user.level);
  
  const attributes = user.attributes || {
    strength: 1, intellect: 1, discipline: 1, creativity: 1, endurance: 1, health: 1
  };
  const inventoryCount = (user.inventory?.length || 0) + (user.badges?.length || 0);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-widest text-white font-mono uppercase flex items-center gap-3">
          <UserIcon className="text-amber-400" />
          CHARACTER SHEET
        </h1>
        <p className="text-slate-500 font-mono text-sm mt-1">Detailed statistics and progression.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
           <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-slate-950/40 border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)] shrink-0 relative z-20">
             <MagicOrb />
           </div>
           
           <div className="flex-1 w-full text-center md:text-left">
             <h2 className="text-3xl font-bold text-white tracking-widest mb-2">{user.name.toUpperCase()}</h2>
             <div className="text-amber-400 font-mono tracking-widest mb-6">FIFTH-YEAR STUDENT</div>
             
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
        
        <h3 className="text-lg font-bold tracking-widest text-slate-300 font-mono mb-6 uppercase border-b border-slate-800 pb-2">
          Combat Stats & Attributes
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           <StatBox label="Intellect" value={attributes.intellect} icon={Brain} colorClass="text-blue-400" />
           <StatBox label="Strength" value={attributes.strength} icon={Dumbbell} colorClass="text-red-400" />
           <StatBox label="Discipline" value={attributes.discipline} icon={Shield} colorClass="text-emerald-400" />
           <StatBox label="Creativity" value={attributes.creativity} icon={Lightbulb} colorClass="text-purple-400" />
           <StatBox label="Endurance" value={attributes.endurance} icon={Activity} colorClass="text-orange-400" />
           <StatBox label="Health" value={attributes.health} icon={Heart} colorClass="text-pink-400" />
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
