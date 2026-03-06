import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/api/services/auth.service";
import { apiClient } from "@/api/client";
import type { User, RegisterInput, ResetPasswordInput } from "@/api/types";

type AuthStep = "idle" | "otp";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  error: string | null;
  // Internal: stored between login step 1 & step 2
  _tempToken: string | null;
  _loginStep: AuthStep;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, data: ResetPasswordInput) => Promise<void>;
  clearError: () => void;
  resetLoginStep: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Wire apiClient to call logout when refresh fails
      apiClient.setAuthErrorCallback(async () => {
        await get().logout();
      });

      // Register the single refresh function — used by both store.refresh() and the 401 interceptor
      apiClient.setRefreshFn(async () => {
        const data = await authService.refresh();
        const existing = get().user;
        set({
          user: {
            id: existing?.id ?? "",
            email: existing?.email ?? "",
            first_name: data.user.first_name ?? existing?.first_name ?? "",
            last_name: data.user.last_name ?? existing?.last_name ?? "",
            role: data.user.role,
            ...(existing?.is_verified !== undefined && { is_verified: existing.is_verified }),
            ...(existing?.created_at && { created_at: existing.created_at }),
            ...(existing?.applicant_profile_id && { applicant_profile_id: existing.applicant_profile_id }),
          },
          isAuthenticated: true,
        });
        return data.accessToken;
      });

      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        _hasHydrated: false,
        error: null,
        _tempToken: null,
        _loginStep: "idle",

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const { tempToken } = await authService.login({ email, password });
            set({ _tempToken: tempToken, _loginStep: "otp", isLoading: false });
          } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
          }
        },

        verifyOtp: async (code) => {
          const { _tempToken } = get();
          if (!_tempToken) return;
          set({ isLoading: true, error: null });
          try {
            const { user } = await authService.verifyAuth(code, _tempToken);
            set({
              user,
              isAuthenticated: true,
              _tempToken: null,
              _loginStep: "idle",
              isLoading: false,
            });
          } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
          }
        },

        register: async (data) => {
          set({ isLoading: true, error: null });
          try {
            await authService.register(data);
            set({ isLoading: false });
          } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
          }
        },

        logout: async () => {
          try {
            await authService.logout();
          } catch {
            // Ignore errors — clear state regardless
          }
          set({
            user: null,
            isAuthenticated: false,
            _tempToken: null,
            _loginStep: "idle",
            error: null,
          });
        },

        refresh: async () => {
          set({ isLoading: true });
          try {
            await apiClient.triggerRefresh();
            set({ isAuthenticated: true, isLoading: false });
          } catch {
            set({ isAuthenticated: false, user: null, isLoading: false });
          }
        },

        forgotPassword: async (email) => {
          set({ isLoading: true, error: null });
          try {
            await authService.forgotPassword({ email });
            set({ isLoading: false });
          } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
          }
        },

        resetPassword: async (token, data) => {
          set({ isLoading: true, error: null });
          try {
            await authService.resetPassword(token, data);
            set({ isLoading: false });
          } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
          }
        },

        clearError: () => set({ error: null }),
        resetLoginStep: () =>
          set({ _loginStep: "idle", _tempToken: null, error: null }),
        setHasHydrated: (val) => set({ _hasHydrated: val }),
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// Convenience selectors
export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectIsLoading = (s: AuthState) => s.isLoading;
export const selectLoginStep = (s: AuthState) => s._loginStep;
