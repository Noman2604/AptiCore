import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/db"
import Question from "@/lib/models/Question"
import { verifyAccessToken } from "@/lib/jwt"
import { logActivity, diff } from "@/lib/audit"
import { getAuthUser } from "@/lib/auth-guard"

// GET /api/questions/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid question ID",
        },
        { status: 400 }
      )
    }

    const question = await Question.findById(id)
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")

    if (!question || !question.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Question not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("Get question error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch question",
      },
      { status: 500 }
    )
  }
}

// PATCH /api/questions/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid question ID",
        },
        { status: 400 }
      )
    }

    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Whitelist allowed fields to prevent NoSQL operator injection
    const allowedFields = [
      "questionText",
      "questionType",
      "options",
      "correctAnswer",
      "explanation",
      "difficultyLevel",
      "marks",
      "negativeMarks",
      "timeLimitSeconds",
      "isActive",
      "categoryId",
      "subcategoryId",
    ]
    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    // Fetch the old question first for diffing
    const oldQuestion = await Question.findById(id).lean()

    const question = await Question.findByIdAndUpdate(id, { $set: updates }, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question not found",
        },
        { status: 404 }
      )
    }
    
    if (oldQuestion) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "update",
        module: "question",
        targetType: "Question",
        targetId: question._id.toString(),
        targetLabel: (question.questionText || "").substring(0, 50),
        status: "success",
        details: diff(oldQuestion, question.toObject())
      })
    }

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("Update question error:", error)
    
    const user = getAuthUser(request)
    if (user) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "update",
        module: "question",
        targetType: "Question",
        status: "failure",
        details: { error: error instanceof Error ? error.message : "Failed to update question" }
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update question",
      },
      { status: 500 }
    )
  }
}

// DELETE /api/questions/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid question ID",
        },
        { status: 400 }
      )
    }

    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const question = await Question.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        returnDocument: "after",
      }
    )

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question not found",
        },
        { status: 404 }
      )
    }

    await logActivity({
      req: request,
      actorId: user.userId,
      actorRole: user.role as any,
      action: "delete",
      module: "question",
      targetType: "Question",
      targetId: question._id.toString(),
      targetLabel: (question.questionText || "").substring(0, 50),
      status: "success",
      details: {
        after: {
          isActive: false
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    })
  } catch (error) {
    console.error("Delete question error:", error)
    
    const user = getAuthUser(request)
    if (user) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "delete",
        module: "question",
        targetType: "Question",
        status: "failure",
        details: { error: error instanceof Error ? error.message : "Failed to delete question" }
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete question",
      },
      { status: 500 }
    )
  }
}
