import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Notification from "@/lib/models/Notification"
import { verifyAccessToken } from "@/lib/jwt"
import {
  seedWelcomeNotificationsIfEmpty,
  createNotification,
} from "@/lib/notifications"

function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  if (!token) return null
  return verifyAccessToken(token)
}

// GET /api/notifications - List user's notifications and unread count
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Seed welcoming notifications if user currently has none
    await seedWelcomeNotificationsIfEmpty(auth.userId)

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 100)
    const offset = parseInt(searchParams.get("offset") || "0", 10)
    const filter = searchParams.get("filter") || "all" // "all" | "unread"

    const baseQuery: { userId: string; isRead?: boolean } = {
      userId: auth.userId,
    }
    if (filter === "unread") {
      baseQuery.isRead = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Notification.countDocuments(baseQuery),
      Notification.countDocuments({ userId: auth.userId, isRead: false }),
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("GET /api/notifications error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { id, markAllRead } = body

    if (markAllRead) {
      await Notification.updateMany(
        { userId: auth.userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      )

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
        unreadCount: 0,
      })
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Notification id or markAllRead is required" },
        { status: 400 }
      )
    }

    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      )
    }

    const unreadCount = await Notification.countDocuments({
      userId: auth.userId,
      isRead: false,
    })

    return NextResponse.json({
      success: true,
      data: updated,
      unreadCount,
    })
  } catch (error) {
    console.error("PATCH /api/notifications error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete a notification or clear read notifications
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    let id = searchParams.get("id")
    let clearAllRead = searchParams.get("clearAllRead") === "true"

    if (!id && !clearAllRead) {
      const body = await request.json().catch(() => ({}))
      id = body?.id
      clearAllRead = Boolean(body?.clearAllRead)
    }

    if (clearAllRead) {
      const res = await Notification.deleteMany({
        userId: auth.userId,
        isRead: true,
      })

      const unreadCount = await Notification.countDocuments({
        userId: auth.userId,
        isRead: false,
      })

      return NextResponse.json({
        success: true,
        message: `Deleted ${res.deletedCount} read notifications`,
        unreadCount,
      })
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Notification id or clearAllRead is required" },
        { status: 400 }
      )
    }

    await Notification.findOneAndDelete({
      _id: id,
      userId: auth.userId,
    })

    const unreadCount = await Notification.countDocuments({
      userId: auth.userId,
      isRead: false,
    })

    return NextResponse.json({
      success: true,
      message: "Notification removed",
      unreadCount,
    })
  } catch (error) {
    console.error("DELETE /api/notifications error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create a test notification or trigger an alert
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const auth = getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { title, message, type = "info", link, targetUserId } = body

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: "Title and message are required" },
        { status: 400 }
      )
    }

    // Only allow targeting other users if admin, otherwise notify self
    const recipientId =
      targetUserId && auth.role === "admin" ? targetUserId : auth.userId

    const notification = await createNotification({
      userId: recipientId,
      title,
      message,
      type,
      link,
    })

    return NextResponse.json({
      success: true,
      data: notification,
      message: "Notification created successfully",
    })
  } catch (error) {
    console.error("POST /api/notifications error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    )
  }
}
