import { z } from "zod"

// ─────────────────────── AUTH SCHEMAS ─────────────────────────────────────
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name too long")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  college: z.string().max(120).trim().optional(),
  phone: z.string().max(20).trim().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain number"),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).trim().optional(),
  college: z.string().max(120).trim().optional(),
  phone: z.string().max(20).trim().optional(),
  bio: z.string().max(300).trim().optional(),
  darkMode: z.boolean().optional(),
  notifications: z.boolean().optional(),
  language: z.string().max(10).optional(),
})

export const createQuestionSchema = z.object({
  title: z.string().min(5, "Title too short").max(500).trim(),
  description: z.string().trim().optional(),
  type: z.enum([
    "mcq",
    "msq",
    "true_false",
    "fill_blank",
    "numerical",
    "coding",
  ]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string().min(1, "Category required"),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(5, "Explanation required").trim(),
  hints: z.array(z.string()).optional(),
  tags: z.array(z.string().toLowerCase().trim()).optional(),
  marks: z.number().min(0).default(1),
  negativeMarks: z.number().min(0).default(0),
  timeLimit: z.number().min(0).optional(),
  codeSnippet: z.string().optional(),
  language: z.string().optional(),
})

export const updateQuestionSchema = createQuestionSchema.partial()

export const createTestSchema = z.object({
  title: z.string().min(5).max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  category: z.string().min(1, "Category required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  totalMarks: z.number().min(1),
  passingScore: z.number().min(0),
  questions: z.array(z.string()).min(1, "At least 1 question required"),
  negativeMarking: z.boolean().default(false),
  negativeMarkValue: z.number().min(0).default(0.25),
  randomizeQuestions: z.boolean().default(false),
  randomizeOptions: z.boolean().default(false),
  showResultImmediately: z.boolean().default(true),
  allowReview: z.boolean().default(true),
  maxAttempts: z.number().min(0).default(0),
  tags: z.array(z.string().toLowerCase().trim()).optional(),
  instructions: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPremium: z.boolean().default(false),
})

export const updateTestSchema = createTestSchema.partial()

export const submitTestSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      userAnswer: z.union([z.string(), z.array(z.string()), z.null()]),
    })
  ),
  timeTaken: z.number().min(0),
  startedAt: z.string().datetime(),
  timeTakenPerQuestion: z.record(z.string(), z.number()).optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(2).max(80).trim(),
  slug: z
    .string()
    .min(2)
    .max(80)
    .toLowerCase()
    .trim()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),
  description: z.string().max(300).trim().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().min(0).default(0),
})

export const updateCategorySchema = createCategorySchema.partial()

export const bulkQuestionSchema = z.object({
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least 1 question required")
    .max(500, "Max 500 at once"),
})

export const createReportSchema = z.object({
  questionId: z.string().optional(),
  testId: z.string().optional(),
  type: z.enum(["wrong_answer", "unclear", "typo", "spam", "other"]),
  description: z.string().min(10, "Please describe the issue").max(1000),
})

export const banUserSchema = z.object({
  reason: z.string().min(5, "Please provide a ban reason").max(500),
  duration: z.number().min(0).optional(), // days, 0 = permanent
})

export const updateUserRoleSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>
export type CreateTestInput = z.infer<typeof createTestSchema>
export type SubmitTestInput = z.infer<typeof submitTestSchema>
