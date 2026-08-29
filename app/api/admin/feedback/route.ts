import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import Feedback from "@/lib/models/Feedback"

function isAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role === "admin" || decoded?.role === "super_admin"
}

function getAuthRole(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role ?? null
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const targetType = searchParams.get("targetType")
    const feedbackType = searchParams.get("feedbackType")
    const limit = Number(searchParams.get("limit") || "50")
    const offset = Number(searchParams.get("offset") || "0")

    const query: Record<string, unknown> = {}
    if (status && status !== "all") query.status = status
    if (targetType && targetType !== "all") query.targetType = targetType
    if (feedbackType && feedbackType !== "all") query.feedbackType = feedbackType

    const total = await Feedback.countDocuments(query)
    const feedback = await Feedback.find(query)
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: feedback,
      meta: { total, limit, offset },
    })
  } catch (error) {
    console.error("Get admin feedback error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Feedback id is required" },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (typeof status === "string") {
      updates.status = status
      if (status === "resolved") {
        updates.resolvedAt = new Date()
        updates.resolvedBy = null
      }
    }
    if (typeof adminNotes === "string") updates.adminNotes = adminNotes

    const updated = await Feedback.findByIdAndUpdate(id, updates, { returnDocument: 'after' })
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Update admin feedback error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update feedback" },
      { status: 500 }
    )
  }
}
