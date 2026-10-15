import { z } from "zod"

/**
 * Validated, type-safe environment configuration.
 * Centralizes all process.env accesses and provides clear failure messages.
 */

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Application
  APP_NAME: z.string().default("AptiCore"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),

  // Database
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // Authentication
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  // Cloudinary (Optional in dev, recommended in prod)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),

  // SMTP Email (Optional in dev, required for auth emails in prod)
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().default("AptiCore <noreply@apticore.in>"),
  EMAIL_VERIFICATION_EXPIRES: z.string().default("24h"),

  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional().default(""),
})

export type Env = z.infer<typeof envSchema>

function getValidatedEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_URL,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/apticore",
    JWT_SECRET:
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV === "production"
        ? ""
        : "apticore-dev-secret-only-never-use-in-production-12345"),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    EMAIL_VERIFICATION_EXPIRES: process.env.EMAIL_VERIFICATION_EXPIRES,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  })

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((i) => ` - ${i.path.join(".")}: ${i.message}`)
      .join("\n")

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `[Environment Config Error] Invalid environment variables in production:\n${errorDetails}`
      )
    } else {
      console.warn(
        `[Environment Config Warning] Missing or invalid environment variables:\n${errorDetails}`
      )
    }

    return parsed.error.issues.length
      ? (process.env as unknown as Env)
      : ({} as Env)
  }

  return parsed.data
}

/**
 * Validated server-side environment variables.
 */
export const env = getValidatedEnv()

/**
 * Public client-safe environment variables.
 */
export const clientEnv = {
  appName: env.APP_NAME,
  baseUrl: env.NEXT_PUBLIC_BASE_URL,
  cloudinaryCloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  gaId: env.NEXT_PUBLIC_GA_ID,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
} as const
