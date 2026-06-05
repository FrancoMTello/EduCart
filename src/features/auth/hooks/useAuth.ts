import { useSyncExternalStore } from "react";
import { authService } from "@/features/auth/services/authService";

const AUTH_UPDATED_EVENT = "educart:auth-updated";
let authSnapshot = authService.getSession();

const notifyAuthUpdated = () => {
  authSnapshot = authService.getSession();
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
};

const subscribeToAuth = (callback: () => void) => {
  const handleStorage = () => {
    authSnapshot = authService.getSession();
    callback();
  };

  window.addEventListener(AUTH_UPDATED_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_UPDATED_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
};

const getSnapshot = () => authSnapshot;

export const useAuth = () => {
  const session = useSyncExternalStore(subscribeToAuth, getSnapshot, () => null);

  return {
    isAuthenticated: Boolean(session),
    login: (email: string, password: string) => {
      const nextSession = authService.login({ email, password });
      notifyAuthUpdated();
      return nextSession;
    },
    logout: () => {
      authService.logout();
      notifyAuthUpdated();
    },
    register: (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
    ) => {
      const nextSession = authService.register({
        email,
        firstName,
        lastName,
        password,
      });
      notifyAuthUpdated();
      return nextSession;
    },
    session,
    user: session?.user ?? null,
  };
};
