import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import AuditLog from "@/lib/models/AuditLog"
import User from "@/lib/models/user"

function isSuperAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role === "super_admin"
}

export async function GET(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || "50")
    const offset = Number(searchParams.get("offset") || "0")
    const actionType = searchParams.get("actionType")
    const targetType = searchParams.get("targetType")

    const query: Record<string, any> = {}
    if (actionType) {
      query.actionType = actionType
    }
    if (targetType) {
      query.targetType = targetType
    }

    const total = await AuditLog.countDocuments(query)
    const logs = await AuditLog.find(query)
      .populate("adminId", "name email role")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: logs,
      total,
    })
  } catch (error) {
    console.error("Get audit logs error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
