import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Archive, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ShopItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  rarity: string;
  icon: string;
}

export default function Inventory() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/shop');
      setItems(data);
    } catch (err) {
      console.error('Error fetching inventory items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (!user) return null;

  const ownedItems = items.filter(item => 
    user.inventory?.includes(item._id) || user.badges?.includes(item._id)
  );

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-widest text-white font-mono uppercase flex items-center gap-3">
          <Archive className="text-cyan-400" />
          ARSENAL
        </h1>
        <p className="text-neutral-500 font-mono text-sm mt-1">Your acquired enhancements and items.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-cyan-500" size={32} />
        </div>
      ) : ownedItems.length === 0 ? (
         <div className="text-center py-16 border border-neutral-800 border-dashed rounded-2xl text-neutral-500 font-mono">
            NO ITEMS ACQUIRED YET.<br/>
            VISIT THE NEXUS MARKET TO SPEND CREDITS.
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ownedItems.map((item) => (
             <motion.div
               key={item._id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-neutral-900/60 border border-neutral-700 rounded-xl p-5 flex flex-col items-center text-center group hover:border-cyan-500/50 transition-colors"
             >
               <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-full flex items-center justify-center mb-4 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                  {/* Map icon string to actual lucide icon ideally, using placeholder for now */}
                  <Archive className="text-neutral-500 group-hover:text-cyan-400 transition-colors" size={24} />
               </div>
               
               <div className="text-[10px] font-mono text-neutral-500 mb-2">{item.type.toUpperCase()}</div>
               <h3 className="text-base font-bold text-white mb-2 leading-tight">{item.name}</h3>
               <p className="text-xs text-neutral-400 flex-1">{item.description}</p>
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
