import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Zap, Shield, Wand2, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { DISCOVERY_QUESTIONS } from '../../data/discoveryQuestions';
import { calculateCharacterProfile, Traits } from '../../services/characterDiscovery';
import { EASING, SPRING } from '../../utils/motion';
import { cn } from '../../utils/cn';
import ThreeDCharacterDisplay from './3DCharacterDisplay';

export default function Discovery() {
  const { user, updateUser } = useAuth();
  
  const [phase, setPhase] = useState<'INTRO' | 'QUESTIONS' | 'AWAKENING' | 'REVEAL'>('INTRO');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [traits, setTraits] = useState<Traits>({
    intellect: 0, courage: 0, discipline: 0, creativity: 0, empathy: 0, energy: 0
  });
  
  const [profile, setProfile] = useState<ReturnType<typeof calculateCharacterProfile> | null>(null);
  
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    if (phase === 'INTRO') {
      const t = setTimeout(() => setPhase('QUESTIONS'), 4000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleOptionSelect = (optionTraits: Partial<Traits>) => {
    // Optimistic trait update
    setTraits(prev => ({
      intellect: prev.intellect + (optionTraits.intellect || 0),
      courage: prev.courage + (optionTraits.courage || 0),
      discipline: prev.discipline + (optionTraits.discipline || 0),
      creativity: prev.creativity + (optionTraits.creativity || 0),
      empathy: prev.empathy + (optionTraits.empathy || 0),
      energy: prev.energy + (optionTraits.energy || 0),
    }));

    if (currentQuestion < DISCOVERY_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsTransitioning(false);
      }, 600);
    } else {
      setTimeout(() => {
        const finalTraits = {
          intellect: traits.intellect + (optionTraits.intellect || 0),
          courage: traits.courage + (optionTraits.courage || 0),
          discipline: traits.discipline + (optionTraits.discipline || 0),
          creativity: traits.creativity + (optionTraits.creativity || 0),
          empathy: traits.empathy + (optionTraits.empathy || 0),
          energy: traits.energy + (optionTraits.energy || 0),
        };
        const generatedProfile = calculateCharacterProfile(finalTraits);
        setProfile(generatedProfile);
        setPhase('AWAKENING');
      }, 600);
    }
  };

  useEffect(() => {
    if (phase === 'AWAKENING') {
      const t = setTimeout(() => {
        setPhase('REVEAL');
      }, 4000); // 4 seconds of awakening animation
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'REVEAL') {
      // Step sequentially through the reveal (Identity -> Class -> Element -> ... Rewards)
      // There are roughly 9 steps.
      const interval = setInterval(() => {
        setRevealStep(prev => {
          if (prev >= 9) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleFinalize = async () => {
    if (!profile) return;
    try {
      const rewards = { xp: 250, credits: 100 };
      const { data } = await api.post('/auth/quiz', {
        characterClass: profile.characterClass,
        identity: profile.identity,
        element: profile.element,
        companion: profile.companion,
        specialAbility: profile.specialAbility,
        baseAttributes: profile.baseAttributes,
        rewards
      });
      updateUser(data);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 404) {
        console.error("Error finalizing discovery", err);
      }
    }
  };

  if (!user || user.quizCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Particles/Fog (Simplified for performance) */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15)_0%,rgba(0,0,0,0)_70%)]" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse pointer-events-none" />

      {/* 3D Background */}
      <AnimatePresence>
        {(phase === 'AWAKENING' || phase === 'REVEAL') && profile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-0 pointer-events-auto"
          >
            <ThreeDCharacterDisplay 
              characterClass={profile.characterClass} 
              element={profile.element} 
              level={1} 
              interactive={phase === 'REVEAL'} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {phase === 'INTRO' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: EASING.smooth }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
              DISCOVER YOUR IDENTITY
            </h1>
            <p className="text-slate-400 font-mono tracking-widest animate-pulse">
              Your choices shape who you become.
            </p>
          </motion.div>
        )}

        {phase === 'QUESTIONS' && (
          <motion.div 
            key="questions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: "blur(5px)" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl w-full px-4 relative z-10"
          >
            <div className="text-center mb-12">
              <div className="text-xs text-amber-500/70 font-mono tracking-[0.3em] mb-4">
                IDENTITY AWAKENING
              </div>
              <div className="flex items-center justify-center gap-3">
                {DISCOVERY_QUESTIONS.map((_, i) => (
                  <motion.div 
                    key={i}
                    className={cn(
                      "h-1.5 transition-all duration-500", 
                      i <= currentQuestion ? "w-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "w-4 bg-slate-800"
                    )}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: EASING.smooth }}
                className="text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 h-20 flex items-center justify-center">
                  {DISCOVERY_QUESTIONS[currentQuestion]?.question}
                </h2>
                
                <div className="space-y-4">
                  {DISCOVERY_QUESTIONS[currentQuestion]?.options?.map((opt) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.traits)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative w-full p-5 text-left rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                      <span className="relative z-10 text-slate-300 group-hover:text-amber-100 transition-colors text-sm md:text-base tracking-wide leading-relaxed">
                        {opt.text}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'AWAKENING' && (
          <motion.div
            key="awakening"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="text-center relative"
          >
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
                filter: ["blur(4px)", "blur(1px)", "blur(4px)"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-amber-400/20 border-t-amber-400/80 border-b-amber-400/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_100px_rgba(251,191,36,0.4)]"
            />
            <div className="w-4 h-4 bg-amber-400 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        )}

        {phase === 'REVEAL' && profile && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md px-4 relative z-10 md:absolute md:left-12 md:top-1/2 md:-translate-y-1/2"
          >
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center relative overflow-hidden">
              
              {/* Backlight matching element approx */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

              <div className="space-y-6 w-full">
                {/* 1. Identity */}
                {revealStep >= 1 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="text-xs font-mono tracking-[0.2em] text-slate-500 mb-1">YOUR IDENTITY</div>
                    <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-widest text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                      {profile.identity}
                    </h2>
                  </motion.div>
                )}

                {/* 2 & 3. Class & Element */}
                {revealStep >= 2 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center gap-4">
                    <div className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded font-mono text-sm text-slate-300">
                      {profile.characterClass}
                    </div>
                    {revealStep >= 3 && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="px-3 py-1 bg-amber-900/20 border border-amber-500/30 rounded font-mono text-sm text-amber-300">
                        {profile.element}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* 4. Primary Attribute */}
                {revealStep >= 4 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                    <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">PRIMARY TRAIT</div>
                    <div className="text-lg font-bold text-white tracking-widest">{profile.primaryAttribute}</div>
                  </motion.div>
                )}

                {/* 5. Companion */}
                {revealStep >= 5 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 border-t border-slate-800/50">
                    <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">COMPANION AWAKENED</div>
                    <div className="text-emerald-400 font-mono">{profile.companion}</div>
                  </motion.div>
                )}

                {/* 6. Special Ability */}
                {revealStep >= 6 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 border-t border-slate-800/50">
                    <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-1">SPECIAL ABILITY</div>
                    <div className="text-purple-400 font-mono tracking-widest font-bold">{profile.specialAbility}</div>
                  </motion.div>
                )}

                {/* 7. Starting Rewards */}
                {revealStep >= 7 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                      <Zap size={16} /> +250 XP
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                      <Star size={16} /> +100 CR
                    </div>
                  </motion.div>
                )}

                {/* 8. Enter button */}
                {revealStep >= 8 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
                    <button
                      onClick={handleFinalize}
                      className="w-full py-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 hover:border-amber-400 text-amber-400 font-mono font-bold tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]"
                    >
                      ENTER QUESTBOUND
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
