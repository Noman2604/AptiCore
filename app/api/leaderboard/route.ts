import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Leaderboard from "@/lib/models/Leaderboard"
import UserProfile from "@/lib/models/UserProfile"

// GET /api/leaderboard - Get global leaderboard
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const offset = parseInt(searchParams.get("offset") || "0")

    const leaderboard = await Leaderboard.find()
      .populate("userId", "name email")
      .sort({ rank: 1 })
      .skip(offset)
      .limit(limit)

    const leaderboardWithAvatars = await Promise.all(
      leaderboard.map(async (entry) => {
        const profile = await UserProfile.findOne({ userId: entry.userId })
        return {
          ...entry.toObject(),
          avatarUrl: profile?.avatarUrl || null,
          avatarBorder: profile?.avatarBorder || "basic",
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: leaderboardWithAvatars,
    })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
