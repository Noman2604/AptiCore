import { apiClient } from "./api-client"

export interface QuestionDTO {
  _id: string
  questionText: string
  difficultyLevel: string
  questionType: string
  marks: number
  timeLimitSeconds: number
  options?: { text: string; order: number }[]
  subcategoryId?: { _id: string; name: string; slug: string }
  categoryId?: { _id: string; name: string; slug: string }
}

export interface SubmitTestPayload {
  testId?: string
  categorySlug: string
  subcategorySlug?: string
  totalQuestions: number
  answeredCount: number
  correctCount?: number
  timeSpentSeconds: number
  answers: Record<string, string | string[]>
  tabSwitches: number
}

export const TestService = {
  /**
   * Fetch questions for a test session by category and optional subcategory
   */
  async getQuestions(
    categorySlug: string,
    subcategorySlug?: string,
    limit = 1000
  ): Promise<QuestionDTO[]> {
    const params = new URLSearchParams()
    params.set("category", categorySlug)
    if (subcategorySlug) params.set("subcategory", subcategorySlug)
    params.set("limit", String(limit))
    params.set("random", "true")

    const res = await apiClient.get<{ success: boolean; data: QuestionDTO[] }>(
      `/questions?${params.toString()}`
    )
    return res.data.data || []
  },

  /**
   * Submit completed test session results
   */
  async submitResult(payload: SubmitTestPayload) {
    const res = await apiClient.post("/results", payload)
    return res.data
  },

  /**
   * Periodically save test progress in background
   */
  async saveProgress(payload: Record<string, unknown>) {
    const res = await apiClient.post("/results/save-progress", payload)
    return res.data
  },
}
