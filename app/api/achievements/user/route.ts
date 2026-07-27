import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import UserAchievement from "@/lib/models/UserAchievement"
import "@/lib/models/Achievement"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/achievements/user - Get current user's earned achievements
export async function GET(request: NextRequest) {
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

    const achievements = await UserAchievement.find({ userId: decoded.userId })
      .populate(
        "achievementId",
        "name description iconUrl criteriaType criteriaValue pointsReward"
      )
      .sort({ unlockedAt: -1 })

    return NextResponse.json({
      success: true,
      data: achievements,
    })
  } catch (error) {
    console.error("Get user achievements error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch user achievements" },
      { status: 500 }
    )
  }
}
