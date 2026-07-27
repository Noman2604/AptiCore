import { NextRequest, NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import User from "@/lib/models/user"
import UserProfile from "@/lib/models/UserProfile"

function isAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null

  return decoded?.role === "admin" || decoded?.role === "super_admin"
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = await params
    const body = await request.json()
    const { name, email, role, isActive, profile } = body

    const updates: Record<string, unknown> = {}
    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email
    if (role !== undefined) updates.role = role
    if (isActive !== undefined) updates.isActive = isActive

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean()

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    let userProfile = await UserProfile.findOne({ userId: id }).lean()

    if (profile) {
      userProfile = await UserProfile.findOneAndUpdate(
        { userId: id },
        {
          $set: {
            totalXP: Number(profile.totalXP ?? 0),
            level: Number(profile.level ?? 1),
            currentStreak: Number(profile.currentStreak ?? 0),
            longestStreak: Number(profile.longestStreak ?? 0),
            college: profile.college,
            location: profile.location,
            phone: profile.phone,
          },
        },
        { new: true, upsert: true, runValidators: true }
      ).lean()
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        _id: user._id.toString(),
        profile: userProfile,
      },
    })
  } catch (error) {
    console.error("Update admin user error:", error)

    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = await params
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password")

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: "User deactivated successfully" },
    })
  } catch (error) {
    console.error("Delete admin user error:", error)

    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
