import {
  useState,
  createContext,
  type ReactNode,
  useEffect,
  useContext,
} from 'react';
import type { User } from '../types/user';
import { auth } from '../api/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLogging: boolean;
  isSigning: boolean;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const login: AuthContextType['login'] = async (email, password) => {
    setIsLogging(true);
    try {
      const res = await auth.login({ email, password });
      if (!res.success)
        throw new Error(`${res.error.code}: ${res.error.message}`);

      localStorage.setItem('recipes-token', res.data.token);
      setUser(res.data.user);
    } finally {
      setIsLogging(false);
    }
  };

  const signup: AuthContextType['signup'] = async (email, password) => {
    setIsSigning(true);
    try {
      const res = await auth.signup({ email, password });
      if (!res.success)
        throw new Error(`${res.error.code}: ${res.error.message}`);

      return res.data;
    } finally {
      setIsSigning(false);
    }
  };

  const logout: AuthContextType['logout'] = async () => {
    // call logout api endpoint

    //
    localStorage.removeItem('recipes-token');
    setUser(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('recipes-token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    async function validateToken() {
      try {
        const res = await auth.me();
        if (!res.success) {
          localStorage.removeItem('recipes-token');
          setUser(null);
          return;
        }
        setUser(res.data);
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, isLogging, signup, isSigning, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
