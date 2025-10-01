"use client";

import { makeStore, type AppStore } from "@/redux/store";
import { setAppPersistor, setAppStore } from "@/redux/storeAccess";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<ReturnType<typeof persistStore> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
    setAppStore(storeRef.current);
    setAppPersistor(persistorRef.current);
  }

  // During SSR, render without PersistGate
  if (!isClient) {
    return <Provider store={storeRef.current}>{children}</Provider>;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
  );
}
