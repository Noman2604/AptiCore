import { NextRequest, NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { getAuthUser } from "@/lib/auth-guard"
import { logActivity, diff } from "@/lib/audit"
import User from "@/lib/models/user"
import UserProfile from "@/lib/models/UserProfile"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = getAuthUser(request)
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
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

    const oldUser = await User.findById(id).lean()
    
    const user = await User.findByIdAndUpdate(id, updates, {
      returnDocument: 'after',
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
        { returnDocument: 'after', upsert: true, runValidators: true }
      ).lean()
    }
    
    if (oldUser) {
      await logActivity({
        req: request,
        actorId: currentUser.userId,
        actorRole: currentUser.role as any,
        action: "update",
        module: "user",
        targetType: "User",
        targetId: user._id.toString(),
        targetLabel: user.name || user.email,
        status: "success",
        details: diff(oldUser as Record<string, any>, user as Record<string, any>)
      })
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
    
    const currentUser = getAuthUser(request)
    if (currentUser) {
      await logActivity({
        req: request,
        actorId: currentUser.userId,
        actorRole: currentUser.role as any,
        action: "update",
        module: "user",
        targetType: "User",
        status: "failure",
        details: { error: error instanceof Error ? error.message : "Failed to update user" }
      })
    }

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
    const currentUser = getAuthUser(request)
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "super_admin")) {
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
      { returnDocument: 'after' }
    ).select("-password")

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }
    
    await logActivity({
      req: request,
      actorId: currentUser.userId,
      actorRole: currentUser.role as any,
      action: "delete",
      module: "user",
      targetType: "User",
      targetId: user._id.toString(),
      targetLabel: user.name || user.email,
      status: "success",
      details: {
        after: {
          isActive: false
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { message: "User deactivated successfully" },
    })
  } catch (error) {
    console.error("Delete admin user error:", error)
    
    const currentUser = getAuthUser(request)
    if (currentUser) {
      await logActivity({
        req: request,
        actorId: currentUser.userId,
        actorRole: currentUser.role as any,
        action: "delete",
        module: "user",
        targetType: "User",
        status: "failure",
        details: { error: error instanceof Error ? error.message : "Failed to delete user" }
      })
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
