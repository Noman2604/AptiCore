import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Achievement from "@/lib/models/Achievement"
import UserAchievement from "@/lib/models/UserAchievement"
import UserProfile from "@/lib/models/UserProfile"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/achievements - List all achievements
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get all achievements
    const achievements = await Achievement.find({ isActive: true }).sort({
      pointsReward: 1,
    })

    // Check for authenticated user
    const accessToken = request.cookies.get("accessToken")?.value
    let userAchievements: string[] = []

    if (accessToken) {
      const decoded = verifyAccessToken(accessToken)

      if (decoded) {
        const earned = await UserAchievement.find({
          userId: decoded.userId,
        }).select("achievementId")
        userAchievements = earned.map((e) => e.achievementId.toString())
      }
    }

    // Mark achievements as earned or not
    const achievementsWithStatus = achievements.map((a) => ({
      ...a.toObject(),
      earned: userAchievements.includes(a._id.toString()),
    }))

    return NextResponse.json({
      success: true,
      data: achievementsWithStatus,
    })
  } catch (error) {
    console.error("Get achievements error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch achievements" },
      { status: 500 }
    )
  }
}

// POST /api/achievements - Award achievement to user (system triggered)
export async function POST(request: NextRequest) {
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
    const { achievementId } = body

    if (!achievementId) {
      return NextResponse.json(
        { success: false, error: "Missing achievementId" },
        { status: 400 }
      )
    }

    // Check if already earned
    const existing = await UserAchievement.findOne({
      userId: decoded.userId,
      achievementId,
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Achievement already earned" },
        { status: 400 }
      )
    }

    // Get achievement details
    const achievement = await Achievement.findById(achievementId)
    if (!achievement) {
      return NextResponse.json(
        { success: false, error: "Achievement not found" },
        { status: 404 }
      )
    }

    // Award achievement
    const userAchievement = await UserAchievement.create({
      userId: decoded.userId,
      achievementId,
    })

    // Update user XP
    await UserProfile.findOneAndUpdate(
      { userId: decoded.userId },
      { $inc: { totalXP: achievement.pointsReward } }
    )

    return NextResponse.json({
      success: true,
      data: userAchievement,
    })
  } catch (error) {
    console.error("Award achievement error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to award achievement" },
      { status: 500 }
    )
  }
}
