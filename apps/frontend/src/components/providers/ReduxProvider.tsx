"use client";

import { createPersistor, makeStore, type AppStore } from "@/redux/store";
import { setAppStore } from "@/redux/storeAccess";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import type { Persistor } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  const persistorRef = useRef<Persistor | undefined>(undefined);

  // Initialize store once
  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = createPersistor(storeRef.current);
    setAppStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
  );
}
