import { useAuth } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-neutral-950/80 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-cyan-400 p-2 hover:bg-neutral-900 rounded-md">
          <Menu size={24} />
        </button>
        <div className="md:hidden text-cyan-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          NEXUS
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">LVL</span>
            <span className="text-cyan-400 font-bold">{user?.level}</span>
          </div>
          <div className="w-px h-4 bg-neutral-800" />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">🪙</span>
            <span className="text-amber-400 font-bold">{user?.credits}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="text-neutral-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-neutral-900"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
