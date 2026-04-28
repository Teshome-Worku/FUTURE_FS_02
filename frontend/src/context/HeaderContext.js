"use client";

import { createContext, useContext, useState, useCallback } from "react";

// ─── Context ─────────────────────────────────────────────────────────────────

const HeaderContext = createContext(null);

// ─── Default State ────────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  title: "",
  showSearch: false,
  actionButton: null, // { label: string, onClick: function }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function HeaderProvider({ children }) {
  const [headerState, setHeaderState] = useState(DEFAULT_STATE);

  /**
   * Merges partial updates into the header state.
   * Pages call this inside useEffect to configure the header.
   */
  const setHeader = useCallback((updates) => {
    setHeaderState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Resets header back to defaults (useful on unmount).
   */
  const resetHeader = useCallback(() => {
    setHeaderState(DEFAULT_STATE);
  }, []);

  return (
    <HeaderContext.Provider value={{ ...headerState, setHeader, resetHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error("useHeader must be used inside <HeaderProvider>");
  }
  return ctx;
}
