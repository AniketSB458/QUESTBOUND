import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Shield, Brain, Dumbbell, Lightbulb, Heart, Target, Activity } from 'lucide-react';
import { getXPProgress } from '../utils/rpgLogic';

const StatBox = ({ label, value, icon: Icon, colorClass }: any) => (
  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg bg-neutral-950 border flex items-center justify-center ${colorClass.replace('text-', 'border-').replace('400', '400/30')}`}>
      <Icon className={colorClass} size={24} />
    </div>
    <div>
      <div className="text-[10px] font-mono text-neutral-500 tracking-widest mb-1">{label.toUpperCase()}</div>
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
          <UserIcon className="text-cyan-400" />
          CHARACTER SHEET
        </h1>
        <p className="text-neutral-500 font-mono text-sm mt-1">Detailed statistics and progression.</p>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
           <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-5xl font-bold text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)] shrink-0">
             {user.name.charAt(0).toUpperCase()}
           </div>
           
           <div className="flex-1 w-full text-center md:text-left">
             <h2 className="text-3xl font-bold text-white tracking-widest mb-2">{user.name.toUpperCase()}</h2>
             <div className="text-cyan-400 font-mono tracking-widest mb-6">CYBER EXPLORER</div>
             
             <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 w-full">
               <div className="flex justify-between items-end mb-2">
                 <div className="text-xs font-mono text-neutral-400 tracking-widest">PROGRESSION TO LVL {user.level + 1}</div>
                 <div className="text-sm font-bold font-mono text-cyan-400">{percentage.toFixed(1)}%</div>
               </div>
               
               <div className="h-2 bg-neutral-900 rounded-full overflow-hidden mb-3">
                 <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${percentage}%` }} />
               </div>
               
               <div className="flex justify-between text-xs font-mono text-neutral-500">
                 <span>{user.xp} TOTAL XP</span>
                 <span>{currentLevelProgress} / {xpNeededForNext} XP TO NEXT LEVEL</span>
               </div>
             </div>
           </div>
        </div>
        
        <h3 className="text-lg font-bold tracking-widest text-neutral-300 font-mono mb-6 uppercase border-b border-neutral-800 pb-2">
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
        
        <h3 className="text-lg font-bold tracking-widest text-neutral-300 font-mono mt-10 mb-6 uppercase border-b border-neutral-800 pb-2">
          Achievement Metrics
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-neutral-400 tracking-widest">CURRENT STREAK</div>
             <div className="text-2xl font-bold text-orange-500 font-mono">{user.streak} DAYS</div>
           </div>
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-neutral-400 tracking-widest">LONGEST STREAK</div>
             <div className="text-2xl font-bold text-orange-400/70 font-mono">{user.longestStreak} DAYS</div>
           </div>
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-neutral-400 tracking-widest">NEXUS CREDITS</div>
             <div className="text-2xl font-bold text-amber-400 font-mono">{user.credits} CR</div>
           </div>
           <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 flex items-center justify-between">
             <div className="text-sm font-mono text-neutral-400 tracking-widest">ITEMS ACQUIRED</div>
             <div className="text-2xl font-bold text-cyan-400 font-mono">{inventoryCount}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
