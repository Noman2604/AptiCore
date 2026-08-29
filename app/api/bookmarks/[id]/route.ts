import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Bookmark from "@/lib/models/Bookmark"
import { verifyAccessToken } from "@/lib/jwt"

// PUT /api/bookmarks/[id] - Update bookmark notes
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
    const { notes } = body

    const { id } = await params
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      { notes },
      { returnDocument: 'after' }
    ).populate({
      path: "questionId",
      select: "questionText options correctAnswer explanation difficultyLevel",
    })

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: "Bookmark not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bookmark,
    })
  } catch (error) {
    console.error("Update bookmark error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update bookmark" },
      { status: 500 }
    )
  }
}

// DELETE /api/bookmarks/[id] - Remove bookmark
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
    const bookmark = await Bookmark.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    })

    if (!bookmark) {
      return NextResponse.json(
        { success: false, error: "Bookmark not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: "Bookmark removed successfully" },
    })
  } catch (error) {
    console.error("Delete bookmark error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete bookmark" },
      { status: 500 }
    )
  }
}
