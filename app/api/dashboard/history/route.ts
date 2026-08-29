import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Result from "@/lib/models/Result"
import XPHistory from "@/lib/models/XPHistory"
import UserAchievement from "@/lib/models/UserAchievement"
import Feedback from "@/lib/models/Feedback"
import "@/lib/models/Achievement"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("accessToken")?.value
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      )
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      role: string
    }

    const userId = decoded.userId

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)

    const page = Math.max(Number(searchParams.get("page")) || 1, 1)

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      50
    )

    const skip = (page - 1) * limit

    const [results, totalResults, xpHistory, totalXpEntries, achievements, totalAchievements, feedback, totalFeedback] = await Promise.all([
      Result.find({ userId })
        .sort({
          submittedAt: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "testId",
          select: "title categoryId subcategory",
          populate: [
            {
              path: "categoryId",
              select: "name slug",
            },
            {
              path: "subcategory",
              select: "name slug",
            },
          ],
        })
        .lean(),

      Result.countDocuments({ userId }),

      XPHistory.find({ userId })
        .sort({ createdAt: -1 })
        .lean(),

      XPHistory.countDocuments({ userId }),

      UserAchievement.find({ userId })
        .sort({ unlockedAt: -1, createdAt: -1 })
        .populate({
          path: "achievementId",
          select:
            "name description iconUrl criteriaType criteriaValue pointsReward rarity",
        })
        .lean(),

      UserAchievement.countDocuments({ userId }),

      Feedback.find({ userId })
        .sort({ createdAt: -1 })
        .lean(),

      Feedback.countDocuments({ userId }),
    ])

    return NextResponse.json({
      success: true,

      data: {
        results,
        xpHistory,
        achievements,
        feedback,

        pagination: {
          page,
          limit,
          totalResults,
          totalXpEntries,
          totalAchievements,
          totalFeedback,
          totalPages: Math.ceil(totalResults / limit),
          hasNextPage: page < Math.ceil(totalResults / limit),
          hasPreviousPage: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("History API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load test history",
      },
      { status: 500 }
    )
  }
}
