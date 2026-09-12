import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckCircle, Clock, Award, TrendingUp, X, Loader2 } from 'lucide-react';
import { calculateQuestRewards, difficultyColors } from '../utils/rpgLogic';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import LevelUpModal from '../components/LevelUpModal';

interface Quest {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  completed: boolean;
  xpReward: number;
  creditReward: number;
  attributeReward: number;
}

const CATEGORIES = ['Coding', 'Study', 'Fitness', 'Health', 'Reading', 'Creativity', 'Personal', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Epic'];

export default function Quests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const { updateUser } = useAuth();
  
  // Level up state
  const [levelUpData, setLevelUpData] = useState<any>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);

  const fetchQuests = async () => {
    try {
      const { data } = await api.get('/quests');
      setQuests(data);
    } catch (error) {
      console.error('Error fetching quests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleAddQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const { data } = await api.post('/quests', {
        title,
        description,
        category,
        difficulty,
      });
      setQuests([data, ...quests]);
      setIsAdding(false);
      setTitle('');
      setDescription('');
      setCategory(CATEGORIES[0]);
      setDifficulty(DIFFICULTIES[0]);
    } catch (error) {
      console.error('Error adding quest', error);
    }
  };

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    try {
      const { data } = await api.post(`/quests/${id}/complete`);
      
      // Optimistic update
      setQuests(quests.map(q => q._id === id ? { ...q, completed: true } : q));
      
      // Update global user state
      updateUser(data.playerState);
      
      if (data.levelUpEvent) {
        setLevelUpData({
          ...data.levelUpEvent,
          rewards: data.rewards
        });
      }
      
    } catch (error) {
      console.error('Error completing quest', error);
      fetchQuests();
    } finally {
      setCompletingId(null);
    }
  };
  
  const handleDelete = async (id: string) => {
     try {
       await api.delete(`/quests/${id}`);
       setQuests(quests.filter(q => q._id !== id));
     } catch (error) {
       console.error('Error deleting quest', error);
     }
  }

  const rewardsPreview = calculateQuestRewards(difficulty);

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white font-mono uppercase">Active Quests</h1>
          <p className="text-neutral-500 font-mono text-sm mt-1">Accept missions to earn rewards and level up.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-4 py-2 rounded-lg font-mono tracking-widest flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">NEW QUEST</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-900/80 border border-cyan-500/30 rounded-xl p-6 mb-8 relative">
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white font-mono tracking-widest mb-6">ESTABLISH NEW DIRECTIVE</h2>
              
              <form onSubmit={handleAddQuest} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">DIRECTIVE TITLE</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-950/50 border border-neutral-800 focus:border-cyan-500/50 rounded-lg px-4 py-2 text-white outline-none transition-all"
                    placeholder="e.g., Complete Math Assignment"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">CATEGORY</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-neutral-950/50 border border-neutral-800 focus:border-cyan-500/50 rounded-lg px-4 py-2 text-white outline-none transition-all"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">DIFFICULTY</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-neutral-950/50 border border-neutral-800 focus:border-cyan-500/50 rounded-lg px-4 py-2 text-white outline-none transition-all"
                    >
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
                  <div className="text-xs font-mono text-neutral-500 min-w-24">EXPECTED YIELD:</div>
                  <div className="flex gap-4">
                    <span className="text-cyan-400 font-bold flex items-center gap-1 text-sm"><TrendingUp size={14}/> +{rewardsPreview.xp} XP</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-sm"><Award size={14}/> +{rewardsPreview.credits} CR</span>
                    <span className="text-purple-400 font-bold flex items-center gap-1 text-sm"><Plus size={14}/> +{rewardsPreview.attribute} STAT</span>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-cyan-500 text-neutral-950 font-bold tracking-widest px-6 py-2 rounded-lg font-mono hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  >
                    DEPLOY QUEST
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {activeQuests.length === 0 ? (
            <div className="text-center py-12 border border-neutral-800 border-dashed rounded-xl text-neutral-500 font-mono">
              NO ACTIVE DIRECTIVES. YOU ARE IDLE.
            </div>
          ) : (
            activeQuests.map((quest) => (
              <motion.div
                key={quest._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded border", difficultyColors[quest.difficulty])}>
                      {quest.difficulty.toUpperCase()}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-neutral-500 px-2 py-0.5 rounded border border-neutral-700 bg-neutral-800/50">
                      {quest.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{quest.title}</h3>
                  
                  <div className="flex gap-4 text-xs font-mono mt-3">
                    <span className="text-cyan-400 flex items-center gap-1"><TrendingUp size={14}/> {quest.xpReward} XP</span>
                    <span className="text-amber-400 flex items-center gap-1"><Award size={14}/> {quest.creditReward} CR</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(quest._id)}
                    className="p-2 sm:p-3 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors sm:opacity-0 group-hover:opacity-100"
                    title="Abort Mission"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={() => handleComplete(quest._id)}
                    disabled={completingId === quest._id}
                    className="flex-1 sm:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 px-4 sm:px-6 py-3 rounded-lg font-mono tracking-widest font-bold flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] disabled:opacity-50"
                  >
                    {completingId === quest._id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span className="hidden sm:inline">COMPLETE</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {completedQuests.length > 0 && (
        <div className="mt-12 opacity-50">
          <h2 className="text-xl font-bold tracking-widest text-neutral-500 font-mono mb-4 uppercase flex items-center gap-2">
            <Clock size={20} />
            Recently Completed
          </h2>
          <div className="space-y-2">
            {completedQuests.slice(0, 5).map(quest => (
              <div key={quest._id} className="flex items-center justify-between p-3 border border-neutral-800/50 rounded-lg bg-neutral-900/20">
                <span className="text-neutral-400 line-through text-sm sm:text-base">{quest.title}</span>
                <span className="text-xs font-mono text-neutral-600">+{quest.xpReward} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUpData && (
           <LevelUpModal data={levelUpData} onClose={() => setLevelUpData(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
