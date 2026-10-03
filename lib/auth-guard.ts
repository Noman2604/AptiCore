import { NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"
import { JwtPayload } from "@/types/auth"

export function getAuthUser(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get("accessToken")?.value
  if (!token) return null
  return verifyAccessToken(token)
}

export function requireRole(request: NextRequest, allowedRoles: string[]): boolean {
  const user = getAuthUser(request)
  if (!user) return false
  return allowedRoles.includes(user.role)
}
