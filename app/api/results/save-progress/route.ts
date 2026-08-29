import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Result from "@/lib/models/Result"
import { verifyAccessToken } from "@/lib/jwt"
import Test from "@/lib/models/Test"
import Subcategory from "@/lib/models/Subcategory"

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
    const { attemptId, categoryId, subcategoryId, progress, startedAt } = body

    if (!attemptId) {
      return NextResponse.json({ success: false, error: "attemptId is required" }, { status: 400 })
    }

    let effectiveCategoryId = categoryId
    let effectiveSubcategoryId = subcategoryId

    if (!effectiveCategoryId && effectiveSubcategoryId) {
      const sub = await Subcategory.findById(effectiveSubcategoryId).select("categoryId")
      if (sub) effectiveCategoryId = sub.categoryId
    }

    const updateData = {
      userId: decoded.userId,
      attemptId,
      status: "in_progress",
      startedAt: startedAt || new Date(),
      totalQuestions: progress?.totalQuestions || 0,
      attemptedQuestions: progress?.attemptedQuestions || 0,
      totalMarks: progress?.totalMarks || 0,
      testName: "Practice Session",
      answers: progress?.answers || [],
    }

    // Try to find if a temp Test exists or link a category
    if (effectiveCategoryId && effectiveSubcategoryId) {
       // We can just leave testId null for in-progress or let it be created upon completion.
    }

    await Result.findOneAndUpdate(
      { userId: decoded.userId, attemptId },
      { $set: updateData },
      { upsert: true, returnDocument: "after" }
    )

    return NextResponse.json({ success: true, message: "Progress saved" })
  } catch (error) {
    console.error("save-progress error:", error)
    return NextResponse.json({ success: false, error: "Failed to save progress" }, { status: 500 })
  }
}
