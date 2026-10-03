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
    const { attemptId, categoryId, subcategoryId, progress, startedAt, testName } = body

    if (!attemptId) {
      return NextResponse.json({ success: false, error: "attemptId is required" }, { status: 400 })
    }

    if (!progress?.attemptedQuestions || progress.attemptedQuestions <= 0) {
      return NextResponse.json({ success: true, message: "No progress to save yet" })
    }

    let effectiveCategoryId = categoryId
    let effectiveSubcategoryId = subcategoryId

    if (!effectiveCategoryId && effectiveSubcategoryId) {
      const sub = await Subcategory.findById(effectiveSubcategoryId).select("categoryId")
      if (sub) effectiveCategoryId = sub.categoryId
    }

    let resolvedTestName =
      testName && !testName.toLowerCase().startsWith("practice session")
        ? testName
        : ""

    if (!resolvedTestName && effectiveSubcategoryId) {
      const sub = await Subcategory.findById(effectiveSubcategoryId).select("name categoryId")
      if (sub) {
        const Category = (await import("@/lib/models/Category")).default
        const cat = await Category.findById(sub.categoryId || effectiveCategoryId).select("name")
        const cleanCat = cat?.name?.replace(/\s+Test$/i, "") || "Aptitude"
        resolvedTestName = `${cleanCat} — ${sub.name} Test`
      }
    }

    const updateData = {
      userId: decoded.userId,
      attemptId,
      status: "in_progress",
      startedAt: startedAt || new Date(),
      totalQuestions: progress?.totalQuestions || 0,
      attemptedQuestions: progress?.attemptedQuestions || 0,
      totalMarks: progress?.totalMarks || 0,
      testName: resolvedTestName || "Practice Test",
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
