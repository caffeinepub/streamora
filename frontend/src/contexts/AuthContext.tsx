import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentSession, setCurrentSession, clearCurrentSession, type CurrentSession } from '../lib/auth';
import { getActiveSiteEvent, type SiteEvent } from '../lib/store';

interface AuthContextType {
  session: CurrentSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (session: CurrentSession) => void;
  logout: () => void;
  siteEvent: SiteEvent | null;
  refreshSiteEvent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const [siteEvent, setSiteEvent] = useState<SiteEvent | null>(null);

  useEffect(() => {
    const stored = getCurrentSession();
    if (stored) setSession(stored);
    setSiteEvent(getActiveSiteEvent());
  }, []);

  const login = useCallback((s: CurrentSession) => {
    setCurrentSession(s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    clearCurrentSession();
    setSession(null);
  }, []);

  const refreshSiteEvent = useCallback(() => {
    setSiteEvent(getActiveSiteEvent());
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      isAuthenticated: !!session,
      isAdmin: session?.isAdmin ?? false,
      login,
      logout,
      siteEvent,
      refreshSiteEvent,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
