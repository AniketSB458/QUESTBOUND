import { useAuth } from '../context/AuthContext';
import { getXPProgress } from '../utils/rpgLogic';
import { Flame, Star, Brain, Dumbbell, Shield, Lightbulb, Heart, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const AttributeBar = ({ label, value, icon: Icon, colorClass }: { label: string, value: number, icon: any, colorClass: string }) => {
  const maxValue = 100; // soft cap for display purposes
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
       <div className="flex justify-between items-center mb-3">
         <div className="flex items-center gap-2 text-neutral-400 font-mono text-sm tracking-widest">
            <Icon size={16} className={colorClass} />
            {label.toUpperCase()}
         </div>
         <div className="text-white font-bold font-mono">{value}</div>
       </div>
       <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div className={`h-full bg-current ${colorClass}`} style={{ width: `${percentage}%` }} />
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
  
  const attributes = user.attributes || {
    strength: 1, intellect: 1, discipline: 1, creativity: 1, endurance: 1, health: 1
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Player Card */}
        <div className="lg:col-span-2 bg-neutral-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.05)]">
           <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Target size={150} />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
             <div className="w-24 h-24 md:w-32 md:h-32 bg-cyan-950 border-2 border-cyan-400/50 rounded-2xl flex items-center justify-center text-4xl font-bold text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
               {user.name.charAt(0).toUpperCase()}
             </div>
             
             <div className="flex-1">
               <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-white">{user.name.toUpperCase()}</h2>
               </div>
               <div className="text-cyan-400 font-mono tracking-widest mb-6">CYBER EXPLORER</div>
               
               <div className="space-y-2">
                 <div className="flex justify-between text-xs font-mono font-bold">
                   <span className="text-cyan-400">LEVEL {user.level}</span>
                   <span className="text-neutral-500">{currentLevelProgress} / {xpNeededForNext} XP</span>
                 </div>
                 <div className="h-3 bg-neutral-950 border border-neutral-800 rounded-full overflow-hidden p-0.5">
                   <div 
                     className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-1000 ease-out" 
                     style={{ width: `${percentage}%` }} 
                   />
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
             <div className="text-xs text-amber-500/70 font-mono tracking-widest mt-1">NEXUS CREDITS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Attributes Section */}
        <div>
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-widest text-neutral-300 font-mono">ATTRIBUTES</h3>
              <Link to="/character" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono tracking-widest">
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
              <h3 className="text-xl font-bold tracking-widest text-neutral-300 font-mono">ACTIVE TASKS</h3>
              <Link to="/quests" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono tracking-widest">
                ALL QUESTS <ArrowRight size={14} />
              </Link>
           </div>
           
           <div className="space-y-3">
              {activeQuests.length === 0 ? (
                <div className="bg-neutral-900/50 border border-neutral-800 border-dashed rounded-xl p-8 text-center text-neutral-500 font-mono text-sm">
                  NO ACTIVE DIRECTIVES. 
                  <br/><br/>
                  <Link to="/quests" className="text-cyan-400 border-b border-cyan-400/30 pb-0.5 hover:text-cyan-300 hover:border-cyan-300 transition-colors">ASSIGN NEW MISSION</Link>
                </div>
              ) : (
                activeQuests.map((quest: any) => (
                  <div key={quest._id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <div className="flex-1 text-sm font-bold text-white">{quest.title}</div>
                    <div className="text-xs text-cyan-400 font-mono">+{quest.xpReward} XP</div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
