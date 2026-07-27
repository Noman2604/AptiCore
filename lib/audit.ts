import AuditLog from "@/lib/models/AuditLog"
import { Types } from "mongoose"

/**
 * Helper function to create an Audit Log record.
 */
export async function logAdminAction(
  adminId: string | Types.ObjectId,
  actionType: "create" | "update" | "delete" | "ban" | "suspend",
  targetType: "user" | "question" | "test" | "category",
  targetId?: string | Types.ObjectId,
  changes?: Record<string, unknown>,
  ipAddress?: string
) {
  try {
    await AuditLog.create({
      adminId,
      actionType,
      targetType,
      targetId,
      changes,
      ipAddress,
    })
  } catch (err) {
    console.error("Failed to write audit log:", err)
  }
}
