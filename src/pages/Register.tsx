import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'motion/react';
import { Zap, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(251,191,36,0.1),transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(251,191,36,0.1)] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-950 border border-amber-400/50 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
             <Zap className="text-amber-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-white font-mono">QUESTBOUND</h1>
          <p className="text-amber-500/70 text-sm tracking-widest mt-1">NEW ENTITY REGISTRATION</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 ml-1 tracking-wider">DESIGNATION (NAME)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:shadow-[0_0_10px_rgba(251,191,36,0.1)]"
              placeholder="Player One"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 ml-1 tracking-wider">COMM LINK (EMAIL)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:shadow-[0_0_10px_rgba(251,191,36,0.1)]"
              placeholder="player@nexus.net"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 ml-1 tracking-wider">ENCRYPTION KEY (PASSWORD)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:shadow-[0_0_10px_rgba(251,191,36,0.1)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 font-bold tracking-widest py-3 rounded-lg mt-4 transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center font-mono"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'CREATE PROFILE'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6 font-mono">
          ALREADY REGISTERED?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 hover:underline">
            RETURN TO LOGIN
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
