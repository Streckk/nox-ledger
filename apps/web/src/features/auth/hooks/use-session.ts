"use client";

import { useMeQuery } from "@/gql";

/** Estado de sesión derivado de la query `me` (cacheada por TanStack Query). */
export function useSession() {
  const { data, isPending, isError, refetch } = useMeQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });

  const user = data?.me ?? null;

  return {
    user,
    isLoading: isPending,
    isAuthenticated: !!user,
    isError,
    refetch,
  };
}
