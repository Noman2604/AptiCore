import { Types } from "mongoose"
import connectDB from "@/lib/db"
import Notification, { NotificationType } from "@/lib/models/Notification"
import User from "@/lib/models/user"

export interface CreateNotificationParams {
  userId: string | Types.ObjectId
  title: string
  message: string
  type?: NotificationType
  link?: string | null
  data?: Record<string, unknown>
}

/**
 * Creates and persists a single user notification in MongoDB.
 */
export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  link = null,
  data = {},
}: CreateNotificationParams) {
  try {
    await connectDB()
    const targetUserId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId

    const notification = await Notification.create({
      userId: targetUserId,
      title,
      message,
      type,
      link: link || undefined,
      data,
      isRead: false,
    })

    return notification
  } catch (error) {
    console.error("Failed to create notification:", error)
    return null
  }
}

/**
 * Broadcast a notification to all users or specific roles.
 */
export async function createBroadcastNotification({
  title,
  message,
  type = "system",
  link = null,
  data = {},
  role,
}: {
  title: string
  message: string
  type?: NotificationType
  link?: string | null
  data?: Record<string, unknown>
  role?: string
}) {
  try {
    await connectDB()
    const filter: Record<string, unknown> = role ? { role } : {}
    const users = await User.find(filter).select("_id")

    if (!users || users.length === 0) return 0

    const docs = users.map((u) => ({
      userId: u._id,
      title,
      message,
      type,
      link: link || undefined,
      data,
      isRead: false,
    }))

    await Notification.insertMany(docs)
    return docs.length
  } catch (error) {
    console.error("Failed to broadcast notification:", error)
    return 0
  }
}

/**
 * Seeds welcome notifications for users who have no notifications yet,
 * giving them instant context on tests, contests, and streaks.
 */
export async function seedWelcomeNotificationsIfEmpty(
  userId: string | Types.ObjectId
) {
  try {
    await connectDB()
    const targetUserId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId

    const existingCount = await Notification.countDocuments({
      userId: targetUserId,
    })

    if (existingCount > 0) return

    const initialNotifications = [
      {
        userId: targetUserId,
        title: "Welcome to AptiCore! 🚀",
        message:
          "Sharpen your aptitude with targeted tests, live contests, and track your percentile ranking.",
        type: "info" as NotificationType,
        link: "/dashboard/tests",
        isRead: false,
      },
      {
        userId: targetUserId,
        title: "Keep Your Streak Alive 🔥",
        message:
          "Complete at least one practice test every day to maintain your streak and earn bonus XP.",
        type: "streak" as NotificationType,
        link: "/dashboard/tests",
        isRead: false,
      },
      {
        userId: targetUserId,
        title: "Compete in Live Contests 🏆",
        message:
          "Register for upcoming aptitude challenges to climb the platform leaderboard.",
        type: "contest" as NotificationType,
        link: "/contest",
        isRead: false,
      },
    ]

    await Notification.insertMany(initialNotifications)
  } catch (error) {
    console.error("Failed to seed initial notifications:", error)
  }
}
