import { useAuth } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCharacterImage } from './discovery/3DCharacterDisplay';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/20 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-amber-400 p-2 hover:bg-slate-900 rounded-md">
          <Menu size={24} />
        </button>
        <div className="md:hidden text-amber-400 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
          QUESTBOUND
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">LVL</span>
            <span className="text-amber-400 font-bold">{user?.level}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-slate-500">🪙</span>
            <span className="text-amber-400 font-bold">{user?.credits}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-10 h-10 rounded-full border border-amber-500/50 overflow-hidden shadow-[0_0_10px_rgba(251,191,36,0.3)] shrink-0">
            {user?.characterClass && user?.characterClass !== 'Unassigned' ? (
              <img src={getCharacterImage(user.characterClass)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-amber-950 flex items-center justify-center text-amber-400 font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-slate-900"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
