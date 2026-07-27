import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/db"
import Question from "@/lib/models/Question"
import { verifyAccessToken } from "@/lib/jwt"

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

    const accessToken = request.cookies.get("accessToken")?.value

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      )
    }

    const decoded = verifyAccessToken(accessToken)

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    const question = await Question.findByIdAndUpdate(id, body, {
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

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("Update question error:", error)

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

    const accessToken = request.cookies.get("accessToken")?.value

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      )
    }

    const decoded = verifyAccessToken(accessToken)

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid token",
        },
        { status: 401 }
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

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    })
  } catch (error) {
    console.error("Delete question error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete question",
      },
      { status: 500 }
    )
  }
}
