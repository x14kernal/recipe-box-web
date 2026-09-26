import { createContext, type ReactNode, useEffect, useContext, useReducer } from 'react';
import type { LoginUser, RegisterUser, User } from '../contracts/user';
import { auth } from '../api/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLogging: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;

  register: (payload: RegisterUser) => Promise<void>;
  login: (payload: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGIN_FAILED' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAILED' }
  | { type: 'LOGOUT_START' }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'LOGOUT_FAILED' }
  | { type: 'AUTH_CHECK_SUCCESS'; user: User }
  | { type: 'AUTH_CHECK_FAILED' };

type AuthState = {
  user: User | null;
  loading: boolean;
  isLogging: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: true,
  isLogging: false,
  isRegistering: false,
  isLoggingOut: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLogging: true };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.user, isLogging: false };
    case 'LOGIN_FAILED':
      return { ...state, isLogging: false };
    case 'REGISTER_START':
      return { ...state, isRegistering: true };
    case 'REGISTER_SUCCESS':
      return { ...state, isRegistering: false };
    case 'REGISTER_FAILED':
      return { ...state, isRegistering: false };
    case 'LOGOUT_START':
      return { ...state, isLoggingOut: true };
    case 'LOGOUT_SUCCESS':
      return { ...state, user: null, isLoggingOut: false };
    case 'LOGOUT_FAILED':
      return { ...state, user: null, isLoggingOut: false };
    case 'AUTH_CHECK_SUCCESS':
      return { ...state, user: action.user, loading: false };
    case 'AUTH_CHECK_FAILED':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login: AuthContextType['login'] = async ({ identifier, password }) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await auth.login({ identifier, password });
      if (!res.success) throw res.error;
      dispatch({ type: 'LOGIN_SUCCESS', user: res.data });
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILED' });
      throw err;
    }
  };

  const register: AuthContextType['register'] = async ({ email, password, username, displayName }) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const res = await auth.register({ username, email, password, displayName });
      if (!res.success) throw res.error;
      dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'REGISTER_FAILED' });
      throw err;
    }
  };

  const logout: AuthContextType['logout'] = async () => {
    dispatch({ type: 'LOGOUT_START' });
    try {
      await auth.logout();
      dispatch({ type: 'LOGOUT_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'LOGOUT_FAILED' });
      throw err;
    }
  };

  useEffect(() => {
    async function verifyAuth() {
      const res = await auth.me();

      if (!res.success) {
        dispatch({ type: 'AUTH_CHECK_FAILED' });
        return;
      }

      dispatch({ type: 'AUTH_CHECK_SUCCESS', user: res.data });
    }

    verifyAuth();
  }, []);

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
