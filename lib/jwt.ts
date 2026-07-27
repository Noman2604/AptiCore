import jwt from "jsonwebtoken"
import { JwtPayload } from "@/types/auth"

const JWT_SECRET =
  process.env.JWT_SECRET || "apticore-jwt-secret-key-change-in-production"

export const generateAccessToken = (payload: {
  userId: string
  role: string
}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  })
}
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}
