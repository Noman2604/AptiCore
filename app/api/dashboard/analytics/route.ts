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
            achievements,
            platformAgg,
            userProfileAgg,
            testsPerUserAgg
        ] = await Promise.all([
            User.findById(userId)
                .select("_id name email role")
                .lean(),

            UserProfile.findOne({ userId })
                .select("currentStreak longestStreak totalXP level questionsAttempted correctAnswers")
                .lean(),

            Result.find({ userId, status: "completed" })
                .sort({ submittedAt: -1, createdAt: -1 })
                .limit(100)
                .populate({
                    path: "testId",
                    select: "title categoryId subcategory totalMarks durationMinutes",
                    populate: {
                        path: "categoryId",
                        select: "name slug",
                    },
                })
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
                .sort({ unlockedAt: -1 })
                .limit(6)
                .populate({
                    path: "achievementId",
                    select:
                        "name description iconUrl criteriaType criteriaValue pointsReward rarity",
                })
                .lean(),

            // Platform aggregate results
            Result.aggregate([
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: null,
                        avgAccuracy: { $avg: "$accuracy" },
                        avgTimeSpent: { $avg: "$timeSpentSeconds" },
                        avgScore: { $avg: "$marksObtained" },
                        totalTests: { $sum: 1 },
                    }
                }
            ]),

            // Platform aggregate profiles
            UserProfile.aggregate([
                {
                    $group: {
                        _id: null,
                        avgXP: { $avg: "$totalXP" },
                        avgStreak: { $avg: "$currentStreak" },
                        totalStudents: { $sum: 1 },
                    }
                }
            ]),

            // Platform average tests per user
            Result.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: "$userId", testsCount: { $sum: 1 } } },
                { $group: { _id: null, avgTestsPerUser: { $avg: "$testsCount" } } }
            ])
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

        const avgAccRaw = platformAgg[0]?.avgAccuracy
        const avgXPRaw = userProfileAgg[0]?.avgXP
        const avgTestsRaw = testsPerUserAgg[0]?.avgTestsPerUser
        const avgTimeRaw = platformAgg[0]?.avgTimeSpent
        const totalStudents = userProfileAgg[0]?.totalStudents || leaderboard.length || 1

        const platformBenchmarks = {
            avgAccuracy: Math.round(avgAccRaw && avgAccRaw > 0 ? avgAccRaw : 58),
            avgXP: Math.round(avgXPRaw && avgXPRaw > 0 ? avgXPRaw : 480),
            avgTestsCompleted: Number((avgTestsRaw && avgTestsRaw > 0 ? avgTestsRaw : 4.5).toFixed(1)),
            avgTimeSpentMinutes: Math.round((avgTimeRaw && avgTimeRaw > 0 ? avgTimeRaw : 900) / 60),
            avgStreak: Math.round(userProfileAgg[0]?.avgStreak || 2),
            totalStudents: Math.max(totalStudents, 1),
            placementCutoffAccuracy: 65,
        }

        const leaderboardWithRank = leaderboard.map(
            (entry: any, index: number) => ({
                ...entry,
                rank: index + 1,
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
                    totalXP: profile?.totalXP || 0,
                    level: profile?.level || 1,
                },

                results: results || [],
                achievements: achievements || [],
                leaderboard: leaderboardWithRank || [],
                benchmarks: platformBenchmarks,
            },
        })
    } catch (error) {
        console.error("Analytics API error:", error)
        return NextResponse.json({success: false, error: "Failed to load analytics data"}, { status: 500 })
    }
}