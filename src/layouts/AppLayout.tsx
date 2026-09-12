import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-cyan-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono tracking-widest text-sm">INITIALIZING NEXUS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-cyan-500/30 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen relative max-h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Futuristic Grid Background Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        </div>
      </div>
    </div>
  );
};
