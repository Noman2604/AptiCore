import jwt from "jsonwebtoken"
import { JwtPayload } from "@/types/auth"

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is missing in production!")
    }
    return "apticore-dev-secret-only-never-use-in-production-12345"
  }
  return secret
}

export const generateAccessToken = (payload: {
  userId: string
  role: string
}) => {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "7d",
  })
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    }) as JwtPayload
  } catch {
    return null
  }
}

