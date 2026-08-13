import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Feedback from "@/lib/models/Feedback"
import Question from "@/lib/models/Question"
import Result from "@/lib/models/Result"
import Test from "@/lib/models/Test"
import { verifyAccessToken } from "@/lib/jwt"

function getAuth(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  return accessToken ? verifyAccessToken(accessToken) : null
}

function isValidTargetType(targetType: unknown): targetType is
  | "question"
  | "test"
  | "result"
  | "page"
  | "platform" {
  return (
    targetType === "question" ||
    targetType === "test" ||
    targetType === "result" ||
    targetType === "page" ||
    targetType === "platform"
  )
}

async function validateTarget(targetType: string, targetId?: string | null) {
  if (!targetId || targetType === "page" || targetType === "platform") {
    return true
  }

  if (targetType === "question") {
    return Boolean(await Question.findById(targetId).select("_id"))
  }

  if (targetType === "test") {
    return Boolean(await Test.findById(targetId).select("_id"))
  }

  if (targetType === "result") {
    return Boolean(await Result.findById(targetId).select("_id"))
  }

  return false
}

// GET /api/feedback - List feedback/comments
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const targetType = searchParams.get("targetType")
    const targetId = searchParams.get("targetId")
    const feedbackType = searchParams.get("feedbackType")
    const status = searchParams.get("status")
    const parentFeedbackId = searchParams.get("parentFeedbackId")
    const mine = searchParams.get("mine") === "true"
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    const query: Record<string, unknown> = {}

    if (mine) query.userId = auth.userId
    if (targetType) query.targetType = targetType
    if (targetId) query.targetId = targetId
    if (feedbackType) query.feedbackType = feedbackType
    if (status && auth.role === "super_admin") query.status = status
    if (parentFeedbackId) query.parentFeedbackId = parentFeedbackId
    if (!status && auth.role !== "super_admin") {
      query.status = { $in: ["published", "resolved"] }
      query.isPublic = true
    }

    const total = await Feedback.countDocuments(query)
    const items = await Feedback.find(query)
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: items,
      meta: { total, limit, offset },
    })
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}

// POST /api/feedback - Create feedback or comment
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      feedbackType = "feedback",
      targetType = "platform",
      targetId = null,
      parentFeedbackId = null,
      title,
      content,
      rating,
      sentiment = "neutral",
      isAnonymous = false,
      isPublic = true,
    } = body

    if (!isValidTargetType(targetType)) {
      return NextResponse.json(
        { success: false, error: "Invalid targetType" },
        { status: 400 }
      )
    }

    if (feedbackType !== "feedback" && feedbackType !== "comment") {
      return NextResponse.json(
        { success: false, error: "Invalid feedbackType" },
        { status: 400 }
      )
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      )
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const isTargetValid = await validateTarget(targetType, targetId)
    if (!isTargetValid) {
      return NextResponse.json(
        { success: false, error: "Target not found" },
        { status: 404 }
      )
    }

    if (parentFeedbackId) {
      const parent = await Feedback.findById(parentFeedbackId).select("_id")
      if (!parent) {
        return NextResponse.json(
          { success: false, error: "Parent feedback not found" },
          { status: 404 }
        )
      }
    }

    const created = await Feedback.create({
      userId: auth.userId,
      feedbackType,
      targetType,
      targetId,
      parentFeedbackId,
      title,
      content: content.trim(),
      rating,
      sentiment,
      isAnonymous,
      isPublic,
      status: auth.role === "super_admin" ? "published" : "pending",
    })

    await created.populate([
      { path: "userId", select: "name email role" },
      { path: "resolvedBy", select: "name email role" },
    ])

    return NextResponse.json({
      success: true,
      data: created,
    })
  } catch (error) {
    console.error("Create feedback error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create feedback" },
      { status: 500 }
    )
  }
}
