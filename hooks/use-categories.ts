import { useQuery } from "@tanstack/react-query"
import { CategoryService } from "@/services/category.service"

export const CATEGORY_QUERY_KEYS = {
  all: ["categories"] as const,
  detail: (slug: string) => ["categories", "detail", slug] as const,
}

/**
 * Hook to fetch and cache all active categories
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.all,
    queryFn: () => CategoryService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })
}

/**
 * Hook to fetch and cache a single category by slug
 */
export function useCategoryDetailQuery(slug?: string | null) {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(slug || ""),
    queryFn: () => (slug ? CategoryService.getBySlug(slug) : null),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  })
}
