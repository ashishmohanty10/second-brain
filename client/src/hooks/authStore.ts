import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: () => {
    set({ isAuthenticated: true });
  },
  logout: () => {
    set({ isAuthenticated: false });
    document.cookie = "access_token=; path=/";
  },
}));
