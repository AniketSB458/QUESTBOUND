import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, User as UserIcon, ShoppingCart, Archive, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/quests', label: 'QUESTS', icon: Target },
  { path: '/character', label: 'CHARACTER', icon: UserIcon },
  { path: '/shop', label: 'QUESTBOUND MARKET', icon: ShoppingCart },
  { path: '/inventory', label: 'ARSENAL', icon: Archive },
  { path: '/history', label: 'HISTORY', icon: Clock },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-amber-500/20">
      <div className="h-16 flex items-center px-6 border-b border-amber-500/20">
        <h1 className="text-xl font-bold tracking-widest text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)] flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-400 animate-pulse rounded-full" />
          QUESTBOUND
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-md font-mono text-sm tracking-wider transition-all duration-300",
                isActive 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.1)px]" 
                  : "text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-transparent"
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-amber-500/20">
         <div className="text-xs font-mono text-slate-600 tracking-widest text-center">
            SYSTEM v1.0.0<br/>
            ONLINE
         </div>
      </div>
    </aside>
  );
};
