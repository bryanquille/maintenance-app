import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Empresa } from '../types/index';

interface AuthState {
  user: User | null;
  token: string | null;
  empresaActiva: Empresa | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setEmpresaActiva: (empresa: Empresa | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      empresaActiva: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, empresaActiva: null, isAuthenticated: false });
      },
      setEmpresaActiva: (empresa) => set({ empresaActiva: empresa }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);