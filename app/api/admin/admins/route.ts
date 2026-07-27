import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import User from "@/lib/models/user"
import UserProfile from "@/lib/models/UserProfile"

function isSuperAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role === "super_admin"
}

export async function GET(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean()

    const profiles = await UserProfile.find({
      userId: { $in: admins.map((admin) => admin._id) },
    }).lean()

    const profileByUserId = new Map(
      profiles.map((profile) => [profile.userId.toString(), profile])
    )

    const data = admins.map((admin) => ({
      ...admin,
      _id: admin._id.toString(),
      profile: profileByUserId.get(admin._id.toString()) ?? null,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Get admins error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch admins" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { userId, role, isActive } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "UserId is required" },
        { status: 400 }
      )
    }

    const updates: Record<string, any> = {}
    if (role !== undefined) updates.role = role
    if (isActive !== undefined) updates.isActive = isActive

    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select("-password")
      .lean()

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        _id: user._id.toString(),
      },
    })
  } catch (error) {
    console.error("Update admin status error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update admin account" },
      { status: 500 }
    )
  }
}
