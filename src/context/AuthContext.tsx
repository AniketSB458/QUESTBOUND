import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  credits: number;
  streak: number;
  longestStreak: number;
  attributes: {
    strength: number;
    intellect: number;
    discipline: number;
    creativity: number;
    energy: number;
    empathy: number;
  };
  characterClass?: string;
  identity?: string;
  element?: string;
  companion?: string;
  specialAbility?: string;
  discoveryVersion?: number;
  quizCompleted?: boolean;
  inventory: string[];
  badges: string[];
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = localStorage.getItem('nexus_user');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
        
        // Optionally verify token and get latest data
        try {
          const { data } = await api.get('/auth/me');
          const updatedUser = { ...parsedUser, ...data };
          setUser(updatedUser);
          localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error("Token verification failed", error);
          // If token invalid, maybe logout? Or let interceptors handle it
        }
      }
      setLoading(false);
    };
    
    fetchUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('nexus_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
