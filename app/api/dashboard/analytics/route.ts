import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import jwt from "jsonwebtoken"
import User from "@/lib/models/user"
import UserProfile from "@/lib/models/UserProfile"
import Result from "@/lib/models/Result"
import Leaderboard from "@/lib/models/Leaderboard"
import UserAchievement from "@/lib/models/UserAchievement"
import "@/lib/models/Test"
import "@/lib/models/Category"

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

        const [
            user,
            profile,
            results,
            leaderboard,
            achievements
        ] = await Promise.all([
            User.findById(userId)
                .select("_id name email role")
                .lean(),

            UserProfile.findOne({ userId })
                .select("currentStreak longestStreak")
                .lean(),

            Result.find({ userId })
                .sort({ submittedAt: -1, createdAt: -1 })
                .limit(10)
                .populate({
                    path: "testId",
                    select: "title categoryId subcategory",
                    populate: {
                        path: "categoryId",
                        select: "name slug",
                    },
                })
                .lean(),

            Leaderboard.find({userId})
                .populate({
                    path: "userId",
                    select: "_id name email",
                })
                .lean(),
            UserAchievement.find({ userId })
                .sort({ unlockedAt: -1 })
                .limit(4)
                .populate({
                    path: "achievementId",
                    select:
                        "name description iconUrl criteriaType criteriaValue pointsReward rarity",
                })
                .lean(),
        ])

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found",
                },
                { status: 404 }
            )
        }

        const leaderboardWithRank = leaderboard.map(
            (entry: any, index: number) => ({
                ...entry,
                rank: entry.rank || index + 1,
            })
        )
        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: String(user._id),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },

                profile: {
                    currentStreak: profile?.currentStreak || 0,
                    longestStreak: profile?.longestStreak || 0,
                },

                results: results || [],
                achievements: achievements||[],
                leaderboard: leaderboardWithRank||[],
            },
        })
    } catch (error) {
        console.error("Analytics API error:", error)
        return NextResponse.json({success: false, error: "Failed to load analytics data"}, { status: 500 })
    }
}