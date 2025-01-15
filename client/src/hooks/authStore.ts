import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: () => {
    console.log("logged in");
    set({ isAuthenticated: true });
    console.log("is authenticated");
  },
  logout: () => {
    set({ isAuthenticated: false });
    document.cookie = "access_token=; path=/";
  },
}));
