import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Test from "@/lib/models/Test"
import { verifyAccessToken } from "@/lib/jwt"
import { logActivity, diff } from "@/lib/audit"
import { getAuthUser } from "@/lib/auth-guard"

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

    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updates = { ...body }

    delete updates._id
    delete updates.createdAt
    delete updates.createdBy

    const { id } = await params
    
    const oldTest = await Test.findById(id).lean()
    
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
    
    if (oldTest) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "update",
        module: "test",
        targetType: "Test",
        targetId: test._id.toString(),
        targetLabel: (test.title || "").substring(0, 50),
        status: "success",
        details: diff(oldTest, test.toObject())
      })
    }

    return NextResponse.json({
      success: true,
      data: test,
    })
  } catch (error) {
    console.error("Update test error:", error)
    
    const user = getAuthUser(request)
    if (user) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "update",
        module: "test",
        targetType: "Test",
        status: "failure",
        details: { error: error instanceof Error ? error.message : "Failed to update test" }
      })
    }
    
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

    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
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
    
    await logActivity({
      req: request,
      actorId: user.userId,
      actorRole: user.role as any,
      action: "delete",
      module: "test",
      targetType: "Test",
      targetId: test._id.toString(),
      targetLabel: (test.title || "").substring(0, 50),
      status: "success",
      details: { deleted: true }
    })

    return NextResponse.json({
      success: true,
      data: { message: "Test deleted successfully" },
    })
  } catch (error) {
    console.error("Delete test error:", error)
    
    const user = getAuthUser(request)
    if (user) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "delete",
        module: "test",
        targetType: "Test",
        status: "failure",
        details: { error: error instanceof Error ? error.message : "Failed to delete test" }
      })
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to delete test" },
      { status: 500 }
    )
  }
}
