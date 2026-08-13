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
    const limit = Number(searchParams.get("limit") || "200")
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    const profiles = await UserProfile.find({
      userId: { $in: users.map((user) => user._id) },
    }).lean()
    const profileByUserId = new Map(
      profiles.map((profile) => [profile.userId.toString(), profile])
    )

    const data = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      profile: profileByUserId.get(user._id.toString()) ?? null,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Get admin users error:", error)

    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const { name, email, role, isActive, profile } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      )
    }

    const user = await User.create({
      name,
      email,
      role: role || "user",
      isActive: isActive ?? true,
    })

    const userProfile = await UserProfile.create({
      userId: user._id,
      totalXP: Number(profile?.totalXP ?? 0),
      level: Number(profile?.level ?? 1),
      currentStreak: Number(profile?.currentStreak ?? 0),
      longestStreak: Number(profile?.longestStreak ?? 0),
      location: profile?.location,
      phone: profile?.phone,
    })

    const { password, ...safeUser } = user.toObject()

    return NextResponse.json(
      {
        success: true,
        data: {
          ...safeUser,
          _id: user._id.toString(),
          profile: userProfile,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create admin user error:", error)

    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    )
  }
}
