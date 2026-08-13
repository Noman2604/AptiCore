import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Feedback from "@/lib/models/Feedback"
import { verifyAccessToken } from "@/lib/jwt"

function getAuth(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  return accessToken ? verifyAccessToken(accessToken) : null
}

async function getFeedbackById(id: string) {
  return Feedback.findById(id)
    .populate("userId", "name email role")
    .populate("resolvedBy", "name email role")
}

// GET /api/feedback/[id] - Fetch one feedback/comment
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await context.params

    const item = await getFeedbackById(id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error("Get feedback by id error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}

// PATCH /api/feedback/[id] - Edit own feedback or moderate as super admin
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const auth = getAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const existing = await Feedback.findById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const isOwner = existing.userId.toString() === auth.userId
    const isSuperAdmin = auth.role === "super_admin"

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const updates: Record<string, unknown> = {}

    if (isOwner) {
      if (typeof body.content === "string") updates.content = body.content.trim()
      if (typeof body.title === "string") updates.title = body.title.trim()
      if (typeof body.rating === "number") updates.rating = body.rating
      if (typeof body.sentiment === "string") updates.sentiment = body.sentiment
      if (typeof body.isAnonymous === "boolean") {
        updates.isAnonymous = body.isAnonymous
      }
      if (typeof body.isPublic === "boolean") updates.isPublic = body.isPublic
    }

    if (isSuperAdmin) {
      if (typeof body.status === "string") updates.status = body.status
      if (typeof body.adminNotes === "string") updates.adminNotes = body.adminNotes
      if (body.resolvedAt !== undefined) {
        updates.resolvedAt = body.resolvedAt ? new Date(body.resolvedAt) : null
      }
      if (body.resolvedBy !== undefined) {
        updates.resolvedBy = body.resolvedBy || null
      }
    }

    const updated = await Feedback.findByIdAndUpdate(id, updates, { new: true })
      .populate("userId", "name email role")
      .populate("resolvedBy", "name email role")

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Update feedback error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update feedback" },
      { status: 500 }
    )
  }
}

// DELETE /api/feedback/[id] - Delete own feedback or moderate as super admin
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const auth = getAuth(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const existing = await Feedback.findById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      )
    }

    const isOwner = existing.userId.toString() === auth.userId
    const isSuperAdmin = auth.role === "super_admin"

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    await Feedback.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    })
  } catch (error) {
    console.error("Delete feedback error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete feedback" },
      { status: 500 }
    )
  }
}
