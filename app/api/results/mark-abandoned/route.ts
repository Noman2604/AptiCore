import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Result from "@/lib/models/Result"
import { verifyAccessToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const accessToken = request.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyAccessToken(accessToken)
    if (!decoded) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { attemptId, categoryId, subcategoryId, startedAt } = body

    if (!attemptId) {
      return NextResponse.json({ success: false, error: "attemptId is required" }, { status: 400 })
    }

    const updateData = {
      userId: decoded.userId,
      attemptId,
      status: "abandoned",
      startedAt: startedAt || new Date(),
      testName: "Practice Session",
      totalQuestions: 0,
      totalMarks: 0,
    }

    await Result.findOneAndUpdate(
      { userId: decoded.userId, attemptId },
      { $set: updateData },
      { upsert: true, returnDocument: "after" }
    )

    return NextResponse.json({ success: true, message: "Test marked as abandoned" })
  } catch (error) {
    console.error("mark-abandoned error:", error)
    return NextResponse.json({ success: false, error: "Failed to mark as abandoned" }, { status: 500 })
  }
}
