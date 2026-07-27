import { NextRequest, NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import Result from "@/lib/models/Result"
import "@/lib/models/Test"

function isAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null

  return decoded?.role === "admin" || decoded?.role === "super_admin"
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
    const offset = Number(searchParams.get("offset") || "0")

    const query: Record<string, unknown> = {}
    if (status && status !== "all") {
      query.status = status
    }

    const total = await Result.countDocuments(query)
    const results = await Result.find(query)
      .populate("userId", "name email")
      .populate("testId", "title totalQuestions totalMarks durationMinutes")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    const data = results.map((result) => ({
      ...result,
      _id: result._id.toString(),
      userId: result.userId
        ? {
            _id: (result.userId as any)._id.toString(),
            name: (result.userId as any).name,
            email: (result.userId as any).email,
          }
        : null,
      testId: result.testId
        ? {
            _id: (result.testId as any)._id.toString(),
            title: (result.testId as any).title,
          }
        : null,
      startedAt: result.startedAt?.toISOString(),
      submittedAt: result.submittedAt?.toISOString(),
      createdAt: result.createdAt?.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data,
      meta: { total, offset, limit },
    })
  } catch (error) {
    console.error("Get admin results error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch results" },
      { status: 500 }
    )
  }
}
