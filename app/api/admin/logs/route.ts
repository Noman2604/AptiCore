import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { getAuthUser, requireRole } from "@/lib/auth-guard"
import AuditLog from "@/lib/models/AuditLog"
import User from "@/lib/models/user"

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()
    void User

    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || "50")
    const page = Number(searchParams.get("page") || "1")
    const offset = (page - 1) * limit
    
    const actorRole = searchParams.get("actorRole")
    const module = searchParams.get("module")
    const action = searchParams.get("action")
    const status = searchParams.get("status")

    const query: Record<string, any> = {}
    
    if (user.role === "admin") {
      // Admins can see user logs and their own logs
      query.$or = [
        { actorRole: "user" },
        { actorId: user.userId }
      ]
    }

    if (actorRole && actorRole !== "all") query.actorRole = actorRole
    if (module && module !== "all") query.module = module
    if (action && action !== "all") query.action = action
    if (status && status !== "all") query.status = status

    const total = await AuditLog.countDocuments(query)
    const logs = await AuditLog.find(query)
      .populate("actorId", "name email role")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: logs,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error("Get audit logs error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
