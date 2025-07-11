import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, Args extends unknown[] = []> extends UseApiState<T> {
  execute: (...args: Args) => Promise<void>;
  reset: () => void;
}

export function useApi<T, Args extends unknown[] = []>(
  apiFunction: (...args: Args) => Promise<{ data: T }>
): UseApiReturn<T, Args> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await apiFunction(...args);
        setState({ data: response.data, loading: false, error: null });
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "response" in error
            ? (error.response as { data?: { message?: string } })?.data
                ?.message || "An error occurred"
            : error instanceof Error
            ? error.message
            : "An error occurred";

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
