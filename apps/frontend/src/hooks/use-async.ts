import * as React from "react";
import { useCallback, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AsyncActions<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  cancel: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): AsyncState<T> & AsyncActions<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Cancel previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        const result = await asyncFunction(...args);

        // Check if request was cancelled
        if (abortControllerRef.current.signal.aborted) {
          throw new Error("Request was cancelled");
        }

        setState((prev) => ({ ...prev, data: result, loading: false }));
        return result;
      } catch (error) {
        // Don't update state if request was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Request was cancelled");
        }

        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        }));
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // Execute immediately if requested
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    cancel,
  };
}

// Specialized async hooks
export function useAsyncCallback<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): [AsyncState<T>, (...args: any[]) => Promise<T>] {
  const { execute, ...state } = useAsync(asyncFunction);
  return [state, execute];
}

export function useAsyncEffect<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = []
): AsyncState<T> {
  const { execute, ...state } = useAsync(asyncFunction);

  React.useEffect(() => {
    execute().catch(() => {
      // Error handling is done in the hook
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, ...deps]);

  return state;
}
