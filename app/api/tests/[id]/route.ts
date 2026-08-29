import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Test from "@/lib/models/Test"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/tests/[id] - Get single test with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const test = await Test.findById(id)
      .populate("categoryId", "name slug")
      .populate("questionIds.questionId")

    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: test,
    })
  } catch (error) {
    console.error("Get test error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch test" },
      { status: 500 }
    )
  }
}

// PUT /api/tests/[id] - Update test (admin only)
export async function PUT(
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

    const body = await request.json()
    const updates = { ...body }

    delete updates._id
    delete updates.createdAt
    delete updates.createdBy

    const { id } = await params
    const test = await Test.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
      runValidators: true,
    }).populate("categoryId", "name slug")

    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: test,
    })
  } catch (error) {
    console.error("Update test error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update test" },
      { status: 500 }
    )
  }
}

// DELETE /api/tests/[id] - Delete test (admin only)
export async function DELETE(
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

    const { id } = await params
    const test = await Test.findByIdAndDelete(id)

    if (!test) {
      return NextResponse.json(
        { success: false, error: "Test not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: "Test deleted successfully" },
    })
  } catch (error) {
    console.error("Delete test error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete test" },
      { status: 500 }
    )
  }
}
