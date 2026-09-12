import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';
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

const RARITY_COLORS: Record<string, string> = {
  Common: 'text-slate-400 border-slate-400/30',
  Uncommon: 'text-green-400 border-green-400/30',
  Rare: 'text-blue-400 border-blue-400/30',
  Epic: 'text-purple-400 border-purple-400/30 shadow-[0_0_15px_rgba(192,132,252,0.2)]',
  Legendary: 'text-orange-400 border-orange-400/30 shadow-[0_0_20px_rgba(251,146,60,0.3)]',
};

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const isPurchasing = useRef(false);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/shop');
      setItems(data);
    } catch (err) {
      console.error('Error fetching shop items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePurchase = async (item: ShopItem) => {
    if (!user || user.credits < item.price || isPurchasing.current) return;
    
    isPurchasing.current = true;
    setPurchasingId(item._id);
    setError(null);
    try {
      const { data } = await api.post(`/shop/${item._id}/purchase`);
      
      updateUser({
        credits: data.credits,
        inventory: data.inventory,
        badges: data.badges
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasingId(null);
      isPurchasing.current = false;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white font-mono uppercase flex items-center gap-3">
            <ShoppingCart className="text-amber-400" />
            QUESTBOUND MARKET
          </h1>
          <p className="text-slate-500 font-mono text-sm mt-1">Exchange credits for enhancements and cosmetics.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-3 self-start md:self-auto">
           <Star className="text-amber-500" size={20} />
           <span className="text-amber-500 font-bold font-mono tracking-widest">{user.credits} CR</span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isOwned = user.inventory?.includes(item._id) || user.badges?.includes(item._id);
            const canAfford = user.credits >= item.price;
            
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-slate-900/60 backdrop-blur-sm border rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all ${isOwned ? 'border-slate-800 opacity-60' : 'border-slate-700 hover:border-amber-500/50'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[10px] font-mono px-2 py-0.5 rounded border ${RARITY_COLORS[item.rarity] || RARITY_COLORS.Common}`}>
                    {item.rarity.toUpperCase()}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50">
                    {item.type.toUpperCase()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-6 flex-1">{item.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                   <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                     <Star size={16} />
                     {item.price}
                   </div>
                   
                   {isOwned ? (
                     <button disabled className="px-4 py-2 bg-slate-800 text-slate-500 rounded-lg font-mono text-sm tracking-widest font-bold">
                       OWNED
                     </button>
                   ) : (
                     <button
                       onClick={() => handlePurchase(item)}
                       disabled={!canAfford || purchasingId === item._id}
                       className={`px-4 py-2 rounded-lg font-mono text-sm tracking-widest font-bold flex items-center justify-center min-w-[100px] transition-all
                         ${canAfford 
                           ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
                           : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                         }`}
                     >
                       {purchasingId === item._id ? <Loader2 className="animate-spin" size={16} /> : 'ACQUIRE'}
                     </button>
                   )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  );
}
