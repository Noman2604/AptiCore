import { create } from "zustand"

export interface TestSessionState {
  // Session info
  testId: string | null
  attemptId: string | null
  categorySlug: string | null
  subcategorySlug: string | null

  // Execution State
  currentIndex: number
  selectedAnswers: Record<string, string | string[]>
  bookmarkedQuestionIds: string[]
  markedForReviewIds: string[]
  questionTimeSpent: Record<string, number>
  tabSwitches: number
  remainingSeconds: number
  totalSeconds: number
  isSubmitted: boolean

  // Actions
  initSession: (payload: {
    testId?: string
    categorySlug?: string
    subcategorySlug?: string
    totalSeconds?: number
  }) => void
  setCurrentIndex: (index: number) => void
  setAnswer: (questionId: string, answer: string | string[]) => void
  clearAnswer: (questionId: string) => void
  toggleBookmark: (questionId: string) => void
  toggleMarkForReview: (questionId: string) => void
  recordQuestionTime: (questionId: string, deltaSeconds: number) => void
  incrementTabSwitches: () => void
  decrementTimer: () => void
  setRemainingSeconds: (seconds: number) => void
  markSubmitted: () => void
  resetSession: () => void
}

const initialState = {
  testId: null,
  attemptId: null,
  categorySlug: null,
  subcategorySlug: null,
  currentIndex: 0,
  selectedAnswers: {},
  bookmarkedQuestionIds: [],
  markedForReviewIds: [],
  questionTimeSpent: {},
  tabSwitches: 0,
  remainingSeconds: 0,
  totalSeconds: 0,
  isSubmitted: false,
}

export const useTestStore = create<TestSessionState>((set) => ({
  ...initialState,

  initSession: ({ testId, categorySlug, subcategorySlug, totalSeconds = 600 }) =>
    set({
      ...initialState,
      testId: testId || null,
      attemptId: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      categorySlug: categorySlug || null,
      subcategorySlug: subcategorySlug || null,
      totalSeconds,
      remainingSeconds: totalSeconds,
    }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: answer,
      },
    })),

  clearAnswer: (questionId) =>
    set((state) => {
      const updated = { ...state.selectedAnswers }
      delete updated[questionId]
      return { selectedAnswers: updated }
    }),

  toggleBookmark: (questionId) =>
    set((state) => {
      const exists = state.bookmarkedQuestionIds.includes(questionId)
      return {
        bookmarkedQuestionIds: exists
          ? state.bookmarkedQuestionIds.filter((id) => id !== questionId)
          : [...state.bookmarkedQuestionIds, questionId],
      }
    }),

  toggleMarkForReview: (questionId) =>
    set((state) => {
      const exists = state.markedForReviewIds.includes(questionId)
      return {
        markedForReviewIds: exists
          ? state.markedForReviewIds.filter((id) => id !== questionId)
          : [...state.markedForReviewIds, questionId],
      }
    }),

  recordQuestionTime: (questionId, deltaSeconds) =>
    set((state) => ({
      questionTimeSpent: {
        ...state.questionTimeSpent,
        [questionId]: (state.questionTimeSpent[questionId] || 0) + deltaSeconds,
      },
    })),

  incrementTabSwitches: () =>
    set((state) => ({ tabSwitches: state.tabSwitches + 1 })),

  decrementTimer: () =>
    set((state) => ({
      remainingSeconds: Math.max(0, state.remainingSeconds - 1),
    })),

  setRemainingSeconds: (seconds) => set({ remainingSeconds: seconds }),

  markSubmitted: () => set({ isSubmitted: true }),

  resetSession: () => set(initialState),
}))
