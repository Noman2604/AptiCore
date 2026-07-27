export type UserRole = "user" | "admin" | "super_admin"
export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType =
  | "mcq"
  | "msq"
  | "true_false"
  | "fill_blank"
  | "numerical"
  | "coding"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  xp: number
  rank: number
  level: number
  badges: Badge[]
  streak: number
  joinedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  questionCount: number
  testCount: number
}

export interface Question {
  id: string
  title: string
  description: string
  type: QuestionType
  difficulty: Difficulty
  category: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  tags: string[]
  timeLimit?: number
  marks: number
  negativeMarks?: number
}

export interface Test {
  id: string
  title: string
  description: string
  category: string
  difficulty: Difficulty
  duration: number
  totalMarks: number
  questions: Question[]
  negativeMarking: boolean
  randomizeQuestions: boolean
  passingScore: number
  attempts: number
  rating: number
  tags: string[]
  createdAt: Date
}

export interface TestResult {
  id: string
  userId: string
  testId: string
  score: number
  totalMarks: number
  percentage: number
  timeTaken: number
  answers: Record<string, string | string[]>
  correctCount: number
  incorrectCount: number
  skippedCount: number
  rank?: number
  completedAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt?: Date
}

export interface LeaderboardEntry {
  rank: number
  user: User
  score: number
  testsCompleted: number
  accuracy: number
  xp: number
}
