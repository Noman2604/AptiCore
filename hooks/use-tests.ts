import { useQuery, useMutation } from "@tanstack/react-query"
import { TestService, SubmitTestPayload } from "@/services/test.service"

export const TEST_QUERY_KEYS = {
  questions: (categorySlug: string, subcategorySlug?: string) =>
    ["test-questions", categorySlug, subcategorySlug || "all"] as const,
}

/**
 * Hook to fetch questions for a practice test
 */
export function useTestQuestionsQuery(
  categorySlug?: string | null,
  subcategorySlug?: string | null
) {
  return useQuery({
    queryKey: TEST_QUERY_KEYS.questions(categorySlug || "", subcategorySlug || undefined),
    queryFn: () => {
      if (!categorySlug) return []
      return TestService.getQuestions(categorySlug, subcategorySlug || undefined)
    },
    enabled: Boolean(categorySlug),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
  })
}

/**
 * Mutation hook to submit completed practice test results
 */
export function useSubmitTestMutation() {
  return useMutation({
    mutationFn: (payload: SubmitTestPayload) => TestService.submitResult(payload),
  })
}
