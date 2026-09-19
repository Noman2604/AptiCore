import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import jwt from "jsonwebtoken"
import User from "@/lib/models/user"
import UserProfile from "@/lib/models/UserProfile"
import Result from "@/lib/models/Result"
import Leaderboard from "@/lib/models/Leaderboard"
import UserAchievement from "@/lib/models/UserAchievement"
import Test from "@/lib/models/Test"


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

        // Purge empty abandoned or ghost results
        await Result.deleteMany({
            userId,
            $or: [
                { status: { $in: ["abandoned", "in_progress"] } },
                { totalMarks: 0, marksObtained: 0, accuracy: 0 },
            ],
        })

        const [
            user,
            profile,
            recentResults,
            allResults,
            allTests,
            leaderboard,
            userachievements,
        ] = await Promise.all([
            User.findById(userId)
                .select("_id name email role")
                .lean(),

            UserProfile.findOne({ userId })
                .lean(),

            Result.find({ userId, status: "completed" })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            Result.find({ userId, status: "completed" })
                .select("accuracy totalMarks marksObtained status createdAt")
                .lean(),

            Test.find({ isPublished: true })
                .select("_id title categoryId")
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
        // Platform-wide benchmark aggregations
        const [platformAgg, userProfileAgg, testsPerUserAgg] = await Promise.all([
            Result.aggregate([
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: null,
                        avgAccuracy: { $avg: "$accuracy" },
                        avgScore: { $avg: "$marksObtained" },
                        totalCompletedTests: { $sum: 1 },
                    }
                }
            ]),
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
            Result.aggregate([
                { $match: { status: "completed" } },
                { $group: { _id: "$userId", testsCount: { $sum: 1 } } },
                { $group: { _id: null, avgTestsPerUser: { $avg: "$testsCount" } } }
            ])
        ])

        const avgAccRaw = platformAgg[0]?.avgAccuracy
        const avgXPRaw = userProfileAgg[0]?.avgXP
        const avgTestsRaw = testsPerUserAgg[0]?.avgTestsPerUser
        const totalStudents = userProfileAgg[0]?.totalStudents || leaderboard.length || 1

        const platformBenchmarks = {
            avgAccuracy: Math.round(avgAccRaw && avgAccRaw > 0 ? avgAccRaw : 58),
            avgXP: Math.round(avgXPRaw && avgXPRaw > 0 ? avgXPRaw : 480),
            avgTestsCompleted: Number((avgTestsRaw && avgTestsRaw > 0 ? avgTestsRaw : 4.5).toFixed(1)),
            avgStreak: Math.round(userProfileAgg[0]?.avgStreak || 2),
            totalStudents: Math.max(totalStudents, 1),
            placementCutoffAccuracy: 65,
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
                allResults: allResults || [],
                totalTestsCompleted: allResults?.length || 0,
                allTests: allTests || [],
                totalAvailableTests: allTests?.length || 0,
                userachievements: userachievements || [],
                leaderboard: leaderboardWithRank,
                benchmarks: platformBenchmarks,
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