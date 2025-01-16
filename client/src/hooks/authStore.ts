interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      login: () => {
        set({ isAuthenticated: true });
      },
      logout: async () => {
        try {
          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
            {
              withCredentials: true,
            }
          );
          set({ isAuthenticated: false });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
      checkAuth: async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify`,
            { withCredentials: true }
          );
          set({
            isAuthenticated: response.data.isAuthenticated,
            isLoading: false,
          });
        } catch (error) {
          console.log(error);
          set({ isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
