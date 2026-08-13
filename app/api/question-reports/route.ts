import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

import connectDB from "@/lib/db"
import Question from "@/lib/models/Question"
import QuestionReport from "@/lib/models/QuestionReport"
import { verifyAccessToken } from "@/lib/jwt"

const reportReasons = [
  "typo",
  "incorrect_question",
  "wrong_answer",
  "other",
  "duplicate",
  "outdated",
] as const

type ReportReason = (typeof reportReasons)[number]

function isReportReason(reason: unknown): reason is ReportReason {
  return typeof reason === "string" && reportReasons.includes(reason as ReportReason)
}

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
    const questionId = searchParams.get("questionId")
    const limit = Number(searchParams.get("limit") || "200")

    const query: Record<string, unknown> = {}
    if (questionId) query.questionId = questionId

    const total = await QuestionReport.countDocuments(query)
    const reports = await QuestionReport.find(query)
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")
      .populate("questionId", "questionText categoryId subcategoryId")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const questionIds = reports
      .map((report) => report.questionId)
      .filter(Boolean)

    const questions = await Question.find({ _id: { $in: questionIds } })
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")
      .select("questionText categoryId subcategoryId")
      .lean()

    return NextResponse.json({
      success: true,
      data: reports,
      meta: { total, limit, questions },
    })
  } catch (error) {
    console.error("Get question reports error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch question reports" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuth(request)
    if (!auth?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const questionId = typeof body.questionId === "string" ? body.questionId : undefined
    const reason = body.reason
    const message = typeof body.message === "string" ? body.message.trim() : undefined

    if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid question ID" },
        { status: 400 }
      )
    }

    const question = await Question.findById(questionId).select("_id")
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      )
    }

    if (!isReportReason(reason)) {
      return NextResponse.json(
        { success: false, error: "Invalid reason" },
        { status: 400 }
      )
    }

    if (!message || message.length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }

    const report = await QuestionReport.create({
      userId: auth.userId,
      questionId,
      reason,
      message,
      isResolved: null,
      resolvedBy: null,
      resolvedAt: null,
      adminRemark: null,
    })

    const createdReport = await QuestionReport.findById(report._id)
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")
      .populate("questionId", "questionText categoryId subcategoryId")
      .lean()

    return NextResponse.json({ success: true, data: createdReport })
  } catch (error) {
    console.error("submit question report error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit question report" },
      { status: 500 }
    )
  }
}
