export type QuestionType =
  | "mcq"
  | "msq"
  | "true_false"
  | "fill_blank"
  | "numerical"
  | "coding"

export interface QuestionOption {
  text: string
  order: number
}

export interface TestQuestion {
  _id: string
  questionText: string
  questionType: QuestionType
  difficultyLevel: "easy" | "medium" | "hard"
  marks: number
  timeLimitSeconds: number
  explanation?: string
  options?: QuestionOption[]
  correctAnswer?: string
}

export interface TestSummary {
  title: string
  description?: string
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
}

export interface TestRunnerProgress {
  answers: Record<string, string | string[]>
  attemptedQuestions: number
  skippedQuestions: number
  correctAnswers: number
  accuracy: number
  timeSpentSeconds: number
}

export interface TestRunnerSubmitAnswer {
  questionId: string
  userAnswer: string
  isBookmarked: boolean
  markedForReview: boolean
  timeSpentSeconds: number
  isCorrect: boolean
}

export interface TestRunnerSubmitPayload {
  answers: TestRunnerSubmitAnswer[]
  attemptedQuestions: number
  skippedQuestions: number
  correctAnswers: number
  accuracy: number
  totalQuestions: number
  totalMarks: number
  timeSpentSeconds: number
  marksObtained: number
}

export interface TestRunnerProps {
  test: TestSummary
  questions: TestQuestion[]
  sectionLabel?: string
  negativeMarking?: number
  onProgressChange?: (progress: TestRunnerProgress) => void
  onSubmit?: (payload: TestRunnerSubmitPayload) => void
}

export const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"] as const
export const RING_CIRCUMFERENCE = 169.6
export const TOTAL_SECONDS_KEY = (minutes: number) => minutes * 60

export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = String(seconds % 60).padStart(2, "0")
  return `${String(minutes).padStart(2, "0")}:${remainingSeconds}`
}

export function isQuestionAnswered(
  answer: string | string[] | undefined
): boolean {
  if (answer === undefined) return false
  if (Array.isArray(answer)) return answer.length > 0
  return String(answer).trim().length > 0
}

export function difficultyPillClass(level: TestQuestion["difficultyLevel"]): string {
  if (level === "easy") return "text-[#3ecf8e] border-[rgba(62,207,142,0.35)]"
  if (level === "hard") return "text-[#f2555a] border-[rgba(242,85,90,0.35)]"
  return "text-[#f5a623] border-[rgba(245,166,35,0.35)]"
}
