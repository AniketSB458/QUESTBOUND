import { useAuth } from '../context/AuthContext';
import { getXPProgress } from '../utils/rpgLogic';
import { Flame, Star, Brain, Dumbbell, Shield, Lightbulb, Heart, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import MagicOrb from '../components/MagicOrb';
import api from '../services/api';
import { getCharacterDetails } from '../utils/character';

const AttributeBar = ({ label, value, icon: Icon, colorClass }: { label: string, value: number, icon: any, colorClass: string }) => {
  const maxValue = 100; // soft cap for display purposes
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
       <div className="flex justify-between items-center mb-3">
         <div className="flex items-center gap-2 text-slate-400 font-mono text-sm tracking-widest">
            <Icon size={16} className={colorClass} />
            {label.toUpperCase()}
         </div>
         <div className="text-white font-bold font-mono">{value}</div>
       </div>
       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-current ${colorClass}`} 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }} 
            transition={{ type: "spring", bounce: 0.2, duration: 1.5 }}
          />
       </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeQuests, setActiveQuests] = useState([]);
  
  useEffect(() => {
    const fetchRecentQuests = async () => {
      try {
        const { data } = await api.get('/quests');
        setActiveQuests(data.filter((q: any) => !q.completed).slice(0, 3));
      } catch (err) {
        // ignore
      }
    };
    fetchRecentQuests();
  }, []);

  if (!user) return null;

  const { currentLevelProgress, xpNeededForNext, percentage } = getXPProgress(user.xp, user.level);
  
  const characterDetails = getCharacterDetails(user.characterClass || 'Unassigned', user.level);
  
  const attributes = user.attributes || {
    strength: 1, intellect: 1, discipline: 1, creativity: 1, energy: 1, empathy: 1
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Player Card */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.05)]">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Target size={150} />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
             <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-950/40 border border-amber-500/30 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.15)] relative z-20 shrink-0 overflow-hidden flex items-center justify-center">
               {user.characterClass && user.characterClass !== 'Unassigned' ? (
                 <img src={characterDetails.avatarUrl} alt={characterDetails.title} className="w-full h-full object-cover opacity-90 scale-125" />
               ) : (
                 <MagicOrb />
               )}
             </div>
             
             <div className="flex-1">
               <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white">{user.name.toUpperCase()}</h2>
               </div>
               <div className="text-amber-400 font-mono tracking-widest mb-6 uppercase">{characterDetails.title}</div>
               
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-mono font-bold">
                   <span className="text-amber-400">LEVEL {user.level}</span>
                   <span className="text-slate-500">{currentLevelProgress} / {xpNeededForNext} XP</span>
                 </div>
                 <div className="h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5 relative">
                   <motion.div 
                     className="h-full bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] relative overflow-hidden" 
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
               </div>
             </div>
           </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
             <Flame className="text-orange-500 mb-2" size={32} />
             <div className="text-3xl font-bold text-white font-mono">{user.streak}</div>
             <div className="text-xs text-orange-500/70 font-mono tracking-widest mt-1">DAY STREAK</div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
             <Star className="text-amber-500 mb-2" size={32} />
             <div className="text-3xl font-bold text-white font-mono">{user.credits}</div>
             <div className="text-xs text-amber-500/70 font-mono tracking-widest mt-1">GALLEONS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Attributes Section */}
        <div>
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-widest text-slate-300 font-mono">ATTRIBUTES</h3>
              <Link to="/character" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono tracking-widest">
                VIEW ALL <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AttributeBar label="Intellect" value={attributes.intellect} icon={Brain} colorClass="text-blue-400" />
              <AttributeBar label="Strength" value={attributes.strength} icon={Dumbbell} colorClass="text-red-400" />
              <AttributeBar label="Discipline" value={attributes.discipline} icon={Shield} colorClass="text-emerald-400" />
              <AttributeBar label="Creativity" value={attributes.creativity} icon={Lightbulb} colorClass="text-purple-400" />
           </div>
        </div>

        {/* Action Center */}
        <div>
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-widest text-slate-300 font-mono">ACTIVE TASKS</h3>
              <Link to="/quests" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono tracking-widest">
                ALL QUESTS <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="space-y-3">
              {activeQuests.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-8 text-center text-slate-500 font-mono text-sm">
                  NO ACTIVE QUESTS. 
                  <br/><br/>
                  <Link to="/quests" className="text-amber-400 border-b border-amber-400/30 pb-0.5 hover:text-amber-300 hover:border-amber-300 transition-colors">ASSIGN NEW MISSION</Link>
                </div>
              ) : (
                activeQuests.map((quest: any) => (
                  <div key={quest._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <div className="flex-1 text-sm font-bold text-white">{quest.title}</div>
                    <div className="text-xs text-amber-400 font-mono">+{quest.xpReward} XP</div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
