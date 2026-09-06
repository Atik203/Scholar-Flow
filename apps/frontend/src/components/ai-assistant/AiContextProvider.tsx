"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useRef } from "react";

export interface PageAiContext {
  type: "paper" | "workspace" | "dashboard";
  id?: string;
  title?: string;
}

interface AiContextValue {
  currentContext: PageAiContext | null;
  setContext: (ctx: PageAiContext | null) => void;
}

const AiCtx = createContext<AiContextValue>({
  currentContext: null,
  setContext: () => {},
});

export function AiContextProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<PageAiContext | null>(null);
  const listenersRef = useRef<Set<(ctx: PageAiContext | null) => void>>(
    new Set()
  );

  const setContext = useCallback((ctx: PageAiContext | null) => {
    ctxRef.current = ctx;
    for (const listener of listenersRef.current) {
      listener(ctx);
    }
  }, []);

  const subscribe = useCallback(
    (listener: (ctx: PageAiContext | null) => void) => {
      listenersRef.current.add(listener);
      return () => { listenersRef.current.delete(listener); };
    },
    []
  );

  const getValue = useCallback(() => {
    return {
      currentContext: ctxRef.current,
      setContext,
      subscribe,
    } as AiContextValue & { subscribe: typeof subscribe };
  }, [setContext, subscribe]);

  // We re-create the value on each render but use refs internally for perf
  const value: AiContextValue = {
    get currentContext() { return ctxRef.current; },
    setContext,
  };

  return <AiCtx.Provider value={value}>{children}</AiCtx.Provider>;
}

export function useAiContext() {
  return useContext(AiCtx);
}
