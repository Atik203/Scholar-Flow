"use client";

import { makeStore, type AppStore } from "@/redux/store";
import { setAppStore } from "@/redux/storeAccess";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setAppStore(storeRef.current);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
