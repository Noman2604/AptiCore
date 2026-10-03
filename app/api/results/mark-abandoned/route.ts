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
    const {
      attemptId,
      startedAt,
      attemptedQuestions,
      testName,
      categoryId,
      subcategoryId,
    } = body

    if (!attemptId) {
      return NextResponse.json({ success: false, error: "attemptId is required" }, { status: 400 })
    }

    // Do not create ghost abandoned results if no questions were attempted
    if (!attemptedQuestions || attemptedQuestions <= 0) {
      await Result.deleteOne({ userId: decoded.userId, attemptId })
      return NextResponse.json({ success: true, message: "Cleaned up unattempted session" })
    }

    let resolvedTestName =
      testName && !testName.toLowerCase().startsWith("practice session")
        ? testName
        : ""

    if (!resolvedTestName && subcategoryId) {
      const Subcategory = (await import("@/lib/models/Subcategory")).default
      const sub = await Subcategory.findById(subcategoryId).select("name categoryId")
      if (sub) {
        const Category = (await import("@/lib/models/Category")).default
        const cat = await Category.findById(sub.categoryId || categoryId).select("name")
        const cleanCat = cat?.name?.replace(/\s+Test$/i, "") || "Aptitude"
        resolvedTestName = `${cleanCat} — ${sub.name} Test`
      }
    }

    const updateData = {
      userId: decoded.userId,
      attemptId,
      status: "abandoned",
      startedAt: startedAt || new Date(),
      testName: resolvedTestName || "Practice Test",
      totalQuestions: 0,
      totalMarks: 0,
      attemptedQuestions,
    }

    await Result.findOneAndUpdate(
      { userId: decoded.userId, attemptId },
      { $set: updateData },
      { upsert: true, returnDocument: "after" }
    )

    const { logActivity } = await import("@/lib/audit")
    await logActivity({
      req: request,
      actorId: decoded.userId,
      actorRole: decoded.role || "user",
      action: "test.abandon",
      module: "result",
      status: "failure",
      targetType: "result",
      targetId: attemptId,
      targetLabel: resolvedTestName || "Practice Test",
      details: {
        attemptId,
        testName: resolvedTestName || "Practice Test",
        attemptedQuestions,
      },
    })

    return NextResponse.json({ success: true, message: "Test marked as abandoned" })
  } catch (error) {
    console.error("mark-abandoned error:", error)
    return NextResponse.json({ success: false, error: "Failed to mark as abandoned" }, { status: 500 })
  }
}
