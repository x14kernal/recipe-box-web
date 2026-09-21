import { useState, createContext, type ReactNode, useEffect, useContext } from 'react';
import type { LoginUser, RegisterUser, User } from '../contracts/user';
import { auth } from '../api/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLogging: boolean;
  isRegistering: boolean;
  register: (payload: RegisterUser) => Promise<User>;
  login: (payload: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const login: AuthContextType['login'] = async ({ identifier, password }) => {
    setIsLogging(true);
    try {
      const res = await auth.login({ identifier, password });
      if (!res.success) throw new Error(`${res.error.code}: ${res.error.message}`);
      setUser(res.data);
    } finally {
      setIsLogging(false);
    }
  };

  const register: AuthContextType['register'] = async ({ email, password, username, displayName }) => {
    setIsRegistering(true);
    try {
      const res = await auth.register({ username, email, password, displayName });
      if (!res.success) throw new Error(`${res.error.code}: ${res.error.message}`);

      return res.data;
    } finally {
      setIsRegistering(false);
    }
  };

  const logout: AuthContextType['logout'] = async () => {
    try {
      await auth.logout();
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await auth.me();

        if (!res.success) {
          setUser(null);
          return;
        }

        setUser(res.data);
      } finally {
        setLoading(false);
      }
    }

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, isLogging, register, isRegistering, logout }}>
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
