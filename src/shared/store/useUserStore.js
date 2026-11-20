import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      token: null,
      userData: null,

      // Define token e dados de uma vez (ideal no login)
      setAuth: (token, userData) => set({ token, userData }),

      // Atualiza parcialmente os dados do usuário sem sobrescrever tudo
      updateUserData: (data) =>
        set((state) => ({
          userData: state.userData ? { ...state.userData, ...data } : data,
        })),

      // Reseta o estado (ideal no logout)
      clearUser: () => set({ token: null, userData: null }),
    }),
    {
      name: 'user-storage', // Chave utilizada no localStorage
    }
  )
);