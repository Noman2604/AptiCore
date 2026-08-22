import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import jwt from "jsonwebtoken"
import User from "@/lib/models/user"
import UserProfile from "@/lib/models/UserProfile"
import Result from "@/lib/models/Result"
import Leaderboard from "@/lib/models/Leaderboard"
import UserAchievement from "@/lib/models/UserAchievement"


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
            recentResults,
            leaderboard,
            userachievements,
        ] = await Promise.all([
            User.findById(userId)
                .select("_id name email role")
                .lean(),

            UserProfile.findOne({ userId })
                .lean(),

            Result.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            Leaderboard.find({})
                .sort({ totalXP: -1 })
                .limit(100)
                .populate({
                    path: "userId",
                    select: "_id name email",
                })
                .lean(),
            UserAchievement.find({ userId })
                .sort({
                    unlockedAt: -1,
                    createdAt: -1,
                })
                .limit(10)
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
        // Add rank based on sorted leaderboard
        const leaderboardWithRank = leaderboard.map((entry: any, index: number) => ({
            ...entry,
            rank: index + 1,
        }))

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },

                profile: {
                    totalXP: profile?.totalXP || 0,
                    level: profile?.level || 1,
                    currentStreak: profile?.currentStreak || 0,
                },
                recentResults: recentResults || [],
                userachievements: userachievements || [],
                leaderboard: leaderboardWithRank,
            },
        })
    } catch (error) {
        console.error("Dashboard API Error:", error)

        return NextResponse.json({
            success: false,
            error: "Failed to load dashboard data",
        },
            { status: 500 }
        )
    }
}