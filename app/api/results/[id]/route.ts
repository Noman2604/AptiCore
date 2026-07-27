import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Result from "@/lib/models/Result"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/results/[id] - Get single result with answers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const accessToken = request.cookies.get("accessToken")?.value
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const decoded = verifyAccessToken(accessToken)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const result = await Result.findOne({
      _id: resolvedParams.id,
      userId: decoded.userId,
    })
      .populate({
        path: "testId",
        select: "title totalQuestions totalMarks durationMinutes categoryId",
        populate: { path: "categoryId", select: "name slug" },
      })
      .populate(
        "answers.questionId",
        "questionText options correctAnswer explanation"
      )

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Get result error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch result" },
      { status: 500 }
    )
  }
}
