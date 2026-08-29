import { NextRequest, NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import QuestionReport from "@/lib/models/QuestionReport"

function isAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role === "admin" || decoded?.role === "super_admin"
}

function getAuth(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  return accessToken ? verifyAccessToken(accessToken) : null
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
    const limit = Number(searchParams.get("limit") || "200")

    const query: Record<string, unknown> = {}
    if (status && status !== "all") {
      query.isResolved = status === "resolved" ? true : status === "rejected" ? false : null
    }

    const reports = await QuestionReport.find(query)
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")
      .populate("questionId", "questionText")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const data = reports.map((report) => {
      const reporter =
        report.userId && typeof report.userId === "object" && "name" in report.userId
          ? {
              name: String((report.userId as { name?: unknown }).name ?? ""),
              email: String((report.userId as { email?: unknown }).email ?? ""),
            }
          : null

      return {
        _id: report._id?.toString?.() ?? "",
        reportType: "question" as const,
        status:
          report.isResolved === true
            ? "resolved"
            : report.isResolved === false
              ? "rejected"
              : "pending",
        reason: report.message,
        adminNotes: report.adminRemark ?? undefined,
        createdAt: report.createdAt?.toISOString(),
        reportedBy: reporter,
        questionId:
          typeof report.questionId === "object" && report.questionId !== null
            ? report.questionId._id?.toString?.()
            : undefined,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Get admin reports error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = getAuth(request)
    if (!auth?.userId || !isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { id, action, adminNotes } = body

    if (!id || typeof action !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = {}

    if (typeof adminNotes === "string") {
      updates.adminRemark = adminNotes.trim() || null
    }

    if (action === "resolve") {
      updates.isResolved = true
      updates.resolvedAt = new Date()
      updates.resolvedBy = auth.userId
    } else if (action === "reject") {
      updates.isResolved = false
      updates.resolvedAt = new Date()
      updates.resolvedBy = auth.userId
    } else if (action === "reopen") {
      updates.isResolved = null
      updates.resolvedAt = null
      updates.resolvedBy = null
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      )
    }

    const updated = await QuestionReport.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")
      .populate("questionId", "questionText")
      .lean()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Update admin report error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update report" },
      { status: 500 }
    )
  }
}
