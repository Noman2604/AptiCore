"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 2 minutes by default
            staleTime: 1000 * 60 * 2,
            // Cache data in memory for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Do not refetch on window focus to avoid interrupting practice tests
            refetchOnWindowFocus: false,
            // Retry failed queries once
            retry: 1,
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
