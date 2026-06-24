"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface AIVisibilityContextValue {
  showFloatingButton: boolean;
  setShowFloatingButton: (show: boolean) => void;
}

const AIVisibilityContext = createContext<AIVisibilityContextValue>({
  showFloatingButton: true,
  setShowFloatingButton: () => {},
});

export function AIVisibilityProvider({ children }: { children: ReactNode }) {
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  return (
    <AIVisibilityContext.Provider value={{ showFloatingButton, setShowFloatingButton }}>
      {children}
    </AIVisibilityContext.Provider>
  );
}

export function useAIVisibility() {
  return useContext(AIVisibilityContext);
}
