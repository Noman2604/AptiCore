import jwt from "jsonwebtoken"
import { JwtPayload } from "@/types/auth"
import { env } from "@/lib/env"

const getJwtSecret = (): string => {
  return env.JWT_SECRET
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

