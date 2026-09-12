import { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Zap, Star, Loader2, Target, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface ActivityRecord {
  _id: string;
  action: string;
  xpEarned: number;
  creditsEarned: number;
  attribute: string;
  attributeIncrease: number;
  date: string;
  details: any;
}

export default function History() {
  const [history, setHistory] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/history');
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-widest text-white font-mono uppercase flex items-center gap-3">
          <Clock className="text-cyan-400" />
          ACTIVITY LOG
        </h1>
        <p className="text-neutral-500 font-mono text-sm mt-1">Chronological record of your progression.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
      ) : history.length === 0 ? (
         <div className="text-center py-16 border border-neutral-800 border-dashed rounded-2xl text-neutral-500 font-mono">
            NO ACTIVITY DETECTED.<br/>
            COMPLETE A QUEST TO BEGIN TRACKING.
         </div>
      ) : (
        <div className="relative border-l border-neutral-800 ml-4 md:ml-8 space-y-8 pb-8">
          {history.map((record, index) => (
             <motion.div 
               key={record._id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.05 }}
               className="relative pl-8 md:pl-12"
             >
                {/* Timeline Dot */}
                <div className={`absolute -left-3 md:-left-4 w-6 h-6 rounded-full border-4 border-neutral-950 flex items-center justify-center ${record.action === 'ITEM_PURCHASED' ? 'bg-amber-400' : 'bg-cyan-400'}`}>
                  {record.action === 'ITEM_PURCHASED' ? <ShoppingCart size={10} className="text-neutral-900" /> : <Target size={10} className="text-neutral-900" />}
                </div>
                
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors">
                   <div className="text-xs font-mono text-neutral-500 mb-2">
                     {format(new Date(record.date), 'MMM dd, yyyy - HH:mm')}
                   </div>
                   
                   {record.action === 'QUEST_COMPLETED' && (
                     <>
                       <h3 className="text-lg font-bold text-white mb-3">
                         Completed: <span className="text-cyan-400">{record.details?.questTitle || 'Unknown Quest'}</span>
                       </h3>
                       
                       <div className="flex flex-wrap gap-3 md:gap-6">
                         {record.xpEarned > 0 && (
                           <div className="flex items-center gap-1.5 text-sm font-mono text-neutral-300">
                             <Zap size={14} className="text-cyan-400" />
                             +{record.xpEarned} XP
                           </div>
                         )}
                         {record.creditsEarned > 0 && (
                           <div className="flex items-center gap-1.5 text-sm font-mono text-neutral-300">
                             <Star size={14} className="text-amber-400" />
                             +{record.creditsEarned} CR
                           </div>
                         )}
                         {record.attributeIncrease > 0 && (
                           <div className="flex items-center gap-1.5 text-sm font-mono text-neutral-300">
                             <span className="text-purple-400 text-xs px-1 border border-purple-400/30 rounded">{record.attribute.toUpperCase()}</span>
                             +{record.attributeIncrease}
                           </div>
                         )}
                       </div>
                       
                       {record.details?.levelUp && (
                         <div className="mt-4 inline-block px-3 py-1 border border-cyan-400/50 bg-cyan-400/10 text-cyan-400 font-mono text-xs tracking-widest rounded-md">
                           LEVELED UP TO {record.details.newLevel}
                         </div>
                       )}
                     </>
                   )}
                   
                   {record.action === 'ITEM_PURCHASED' && (
                     <>
                       <h3 className="text-lg font-bold text-white mb-2">
                         Acquired: <span className="text-amber-400">{record.details?.itemName || 'Unknown Item'}</span>
                       </h3>
                       <div className="flex items-center gap-1.5 text-sm font-mono text-neutral-400">
                         Spent {record.details?.price} Credits
                       </div>
                     </>
                   )}
                </div>
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
