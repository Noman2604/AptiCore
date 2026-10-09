import { NextRequest } from "next/server"
import { Types } from "mongoose"
import AuditLog from "@/lib/models/AuditLog"
import { getAuthUser } from "@/lib/auth-guard"

type ActivityModule = "auth" | "test" | "result" | "question" | "category" | "user" | "settings" | "feedback" | "report" | "achievement" | "bookmark" | "system"

interface LogActivityParams {
  req?: NextRequest
  actorId?: string | Types.ObjectId
  actorRole?: "user" | "admin" | "super_admin" | "system" | "guest" | string
  actorName?: string
  actorEmail?: string
  action: string
  module: ActivityModule
  status?: "success" | "failure"
  targetType?: string
  targetId?: string | Types.ObjectId
  targetLabel?: string
  details?: Record<string, any>
}

function sanitizeDetails(details: Record<string, any>): Record<string, any> {
  const sanitized = { ...details }
  const sensitiveKeys = [
    "password",
    "token",
    "otp",
    "verificationCode",
    "verificationToken",
    "hashedOtp",
    "hashedToken",
    "secret",
  ]
  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = "***"
    }
  }
  return sanitized
}

export function diff<T extends Record<string, any>>(before: T, after: T): { before: Partial<T>; after: Partial<T> } {
  const diffBefore: any = {}
  const diffAfter: any = {}
  
  const allKeys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})])
  
  for (const key of allKeys) {
    if (JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])) {
      diffBefore[key] = before?.[key]
      diffAfter[key] = after?.[key]
    }
  }
  
  return { before: diffBefore, after: diffAfter }
}

export async function logActivity(params: LogActivityParams) {
  try {
    let {
      req,
      actorId,
      actorRole,
      actorName,
      actorEmail,
      action,
      module,
      status = "success",
      targetType,
      targetId,
      targetLabel,
      details,
    } = params

    let ipAddress = undefined
    let userAgent = undefined

    if (req) {
      ipAddress = req.headers.get("x-forwarded-for") || undefined
      userAgent = req.headers.get("user-agent") || undefined
      
      if (!actorId || !actorRole) {
        const auth = getAuthUser(req)
        if (auth) {
          actorId = actorId || auth.userId
          actorRole = actorRole || auth.role
        }
      }
    }

    const validRoles = ["user", "admin", "super_admin", "system", "guest"] as const
    type ValidRole = (typeof validRoles)[number]
    let normalizedRole: ValidRole = "guest"
    if (actorRole && validRoles.includes(actorRole as ValidRole)) {
      normalizedRole = actorRole as ValidRole
    } else if (actorId) {
      normalizedRole = "user"
    }

    if (details) {
      details = sanitizeDetails(details)
    }

    await AuditLog.create({
      actorId,
      actorRole: normalizedRole,
      actorName,
      actorEmail,
      action,
      module,
      status,
      targetType,
      targetId: targetId ? String(targetId) : undefined,
      targetLabel,
      details,
      ipAddress,
      userAgent,
    })
  } catch (err) {
    console.error("Failed to write activity log:", err)
  }
}

/**
 * Backward compatibility wrapper.
 */
export async function logAdminAction(
  adminId: string | Types.ObjectId,
  actionType: "create" | "update" | "delete" | "ban" | "suspend",
  targetType: "user" | "question" | "test" | "category",
  targetId?: string | Types.ObjectId,
  changes?: Record<string, unknown>,
  ipAddress?: string
) {
  await logActivity({
    actorId: adminId,
    actorRole: "admin", // Assuming admin for compatibility
    action: `${targetType}.${actionType}`,
    module: targetType as ActivityModule,
    targetType,
    targetId,
    details: changes,
  })
}
