import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Bookmark from "@/lib/models/Bookmark"
import Question from "@/lib/models/Question"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/bookmarks - List user's bookmarked questions
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const total = await Bookmark.countDocuments({ userId: decoded.userId })
    const bookmarks = await Bookmark.find({ userId: decoded.userId })
      .populate({
        path: "questionId",
        select:
          "questionText options correctAnswer explanation difficultyLevel categoryId",
        populate: { path: "categoryId", select: "name slug" },
      })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: bookmarks,
      meta: { total, limit, offset },
    })
  } catch (error) {
    console.error("Get bookmarks error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookmarks" },
      { status: 500 }
    )
  }
}

// POST /api/bookmarks - Bookmark a question
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { questionId, notes } = body

    if (!questionId) {
      return NextResponse.json(
        { success: false, error: "Missing questionId" },
        { status: 400 }
      )
    }

    // Check if question exists
    const question = await Question.findById(questionId)
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      )
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
      userId: decoded.userId,
      questionId,
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Question already bookmarked" },
        { status: 400 }
      )
    }

    const bookmark = await Bookmark.create({
      userId: decoded.userId,
      questionId,
      notes,
    })

    await bookmark.populate({
      path: "questionId",
      select: "questionText options correctAnswer explanation difficultyLevel",
    })

    return NextResponse.json({
      success: true,
      data: bookmark,
    })
  } catch (error) {
    console.error("Create bookmark error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create bookmark" },
      { status: 500 }
    )
  }
}
