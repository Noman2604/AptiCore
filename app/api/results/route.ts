import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/db"
import Achievement from "@/lib/models/Achievement"
import Leaderboard from "@/lib/models/Leaderboard"
import Result from "@/lib/models/Result"
import Test from "@/lib/models/Test"
import UserAchievement from "@/lib/models/UserAchievement"
import UserProfile from "@/lib/models/UserProfile"
import "@/lib/models/Category"
import Subcategory from "@/lib/models/Subcategory"
import XPHistory from "@/lib/models/XPHistory"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/results - List user's test results
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    const query: Record<string, unknown> = { userId: decoded.userId }

    if (status && status !== "all") {
      query.status = status
    } else if (!status) {
      query.status = "completed"
    }

    const total = await Result.countDocuments(query)
    const results = await Result.find(query)
      .populate({
        path: "testId",
        select:
          "title totalQuestions totalMarks durationMinutes categoryId subcategory sessionType",
        populate: [
          { path: "categoryId", select: "name slug" },
          { path: "subcategory", select: "name slug" },
        ],
      })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: results,
      meta: { total, limit, offset },
    })
  } catch (error) {
    console.error("Get results error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch results" },
      { status: 500 }
    )
  }
}

// POST /api/results - Submit test result
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
    const {
      testId,
      categoryId,
      subcategoryId,
      totalQuestions,
      testName,
      attemptedQuestions,
      correctAnswers,
      skippedQuestions,
      marksObtained,
      totalMarks,
      durationMinutes,
      timeSpentSeconds,
      answers,
      startedAt,
      accuracy: providedAccuracy,
      sessionType,
      attemptId,
    } = body

    const normalizedAnswers = Array.isArray(answers) ? answers : []

    // We allow skipped questions or unanswered questions because running out of time or skipping is normal.

    // Accept `subcategory` as a fallback key from clients that send it
    let providedSubcategoryId = subcategoryId ?? (body as any).subcategory
    let effectiveCategoryId =
      categoryId ?? (body as any).categoryId ?? (body as any).category

    let effectiveTestId: any = testId
    let test: any = null

    if (effectiveTestId) {
      test = await Test.findById(effectiveTestId)
      if (!test) {
        return NextResponse.json(
          { success: false, error: "Test not found" },
          { status: 404 }
        )
      }
    } else {
      // Ensure we have at least one of categoryId or subcategoryId
      if (!effectiveCategoryId && !providedSubcategoryId) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing categoryId or subcategoryId for practice session",
          },
          { status: 400 }
        )
      }

      // If categoryId is missing but subcategoryId is provided, derive categoryId
      if (!effectiveCategoryId && providedSubcategoryId) {
        const sub = await Subcategory.findById(providedSubcategoryId).select(
          "categoryId"
        )
        if (!sub) {
          return NextResponse.json(
            { success: false, error: "Subcategory not found" },
            { status: 404 }
          )
        }
        effectiveCategoryId = sub.categoryId
      }

      // If subcategory is not provided but categoryId is present, pick a default subcategory
      if (!providedSubcategoryId && effectiveCategoryId) {
        const subOne = await Subcategory.findOne({
          categoryId: effectiveCategoryId,
        }).select("_id")
        if (!subOne) {
          return NextResponse.json(
            {
              success: false,
              error: "No subcategory found for provided categoryId",
            },
            { status: 400 }
          )
        }
        providedSubcategoryId = subOne._id
      }

      const tempTest: any = await (Test as any).create({
        title: "Practice session ",
        description: "Mixed practice session",
        categoryId: effectiveCategoryId,
        subcategory: providedSubcategoryId,
        sessionType: sessionType === "mixed" ? "mixed" : "subcategory",
        questionIds: [],
        totalQuestions: totalQuestions || 0,
        totalMarks: totalMarks || 0,
        durationMinutes: durationMinutes || 0,
        difficultyLevel: "medium",
        isPublished: false,
        createdBy: decoded.userId,
      })

      effectiveTestId = tempTest?._id
      test = tempTest
    }

    const accuracy =
      typeof providedAccuracy === "number"
        ? providedAccuracy
        : totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0

    const resultData = {
      userId: decoded.userId,
      testId: effectiveTestId,
      totalQuestions,
      testName: testName || test?.title || "Practice Session",
      attemptedQuestions: attemptedQuestions || 0,
      correctAnswers: correctAnswers || 0,
      skippedQuestions: skippedQuestions || 0,
      accuracy,
      marksObtained: marksObtained || 0,
      totalMarks: totalMarks || 0,
      timeSpentSeconds: timeSpentSeconds || 0,
      status: "completed",
      answers: normalizedAnswers,
      startedAt: startedAt || new Date(),
      submittedAt: new Date(),
      attemptId,
    };

    let result: any;
    if (attemptId) {
      result = await Result.findOneAndUpdate(
        { userId: decoded.userId, attemptId },
        { $set: resultData },
        { upsert: true, returnDocument: "after" }
      );
    } else {
      result = await Result.create(resultData);
    }

    // Update user XP, level, and streak for this completion event
    const xpEarned = Math.round((correctAnswers || 0) * 10)
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]

    let newStreak = 1
    let newLongestStreak = 1

    // Get existing profile to calculate streak and level
    const existingProfile = await UserProfile.findOne({
      userId: decoded.userId,
    })
    if (existingProfile) {
      const lastActivity = existingProfile.lastActivityDate
      const currentStreak = existingProfile.currentStreak || 0
      const longestStreak = existingProfile.longestStreak || 0

      if (lastActivity) {
        const lastActivityStr = lastActivity.toISOString().split("T")[0]

        if (todayStr === lastActivityStr) {
          // Same day activity, streak remains the same
          newStreak = currentStreak === 0 ? 1 : currentStreak
          newLongestStreak = longestStreak
        } else {
          const todayDate = new Date(todayStr)
          const lastActivityDateObj = new Date(lastActivityStr)
          const diffTime = Math.abs(
            todayDate.getTime() - lastActivityDateObj.getTime()
          )
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            // Consecutive day
            newStreak = currentStreak + 1
            newLongestStreak = Math.max(longestStreak, newStreak)
          } else {
            // Broken streak
            newStreak = 1
            newLongestStreak = Math.max(longestStreak, 1)
          }
        }
      } else {
        newStreak = 1
        newLongestStreak = Math.max(longestStreak, 1)
      }
    }

    const currentXP = existingProfile ? existingProfile.totalXP || 0 : 0
    const newXP = currentXP + xpEarned
    const previousLevel = existingProfile?.level ?? 1
    const newLevel = Math.max(1, Math.floor(newXP / 500) + 1)

    const profile = await UserProfile.findOneAndUpdate(
      { userId: decoded.userId },
      {
        $set: {
          totalXP: newXP,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: now,
        },
      },
      { returnDocument: 'after', upsert: true }
    )

    if (profile) {
      await XPHistory.create({
        userId: decoded.userId,
        xpPoints: xpEarned,
        sourceType: "test_completion",
        sourceId: result._id,
      })
    }

    const completedTestsCount = await Result.countDocuments({
      userId: decoded.userId,
      status: "completed",
    })

    const earnedAchievements = await UserAchievement.find({
      userId: decoded.userId,
    }).select("achievementId")

    const earnedAchievementIds = earnedAchievements.map((item) =>
      item.achievementId.toString()
    )

    const candidateAchievements = await Achievement.find({
      isActive: true,
      _id: { $nin: earnedAchievementIds },
    })

    const achievementsToAward = candidateAchievements.filter((achievement) => {
      switch (achievement.criteriaType) {
        case "test_count":
          return completedTestsCount >= achievement.criteriaValue
        case "score":
          return (profile?.totalXP ?? 0) >= achievement.criteriaValue
        case "accuracy":
          return accuracy >= achievement.criteriaValue
        case "time_spent":
          return timeSpentSeconds >= achievement.criteriaValue * 60
        case "streak":
          return (profile?.currentStreak ?? 0) >= achievement.criteriaValue
        default:
          return false
      }
    })

    const awardedAchievements: Array<{
      name: string
      description?: string
      pointsReward?: number
    }> = []

    if (achievementsToAward.length > 0) {
      for (const achievement of achievementsToAward) {
        try {
          await UserAchievement.create({
            userId: decoded.userId,
            achievementId: achievement._id,
          })

          awardedAchievements.push({
            name: achievement.name,
            description: achievement.description,
            pointsReward: achievement.pointsReward,
          })

          await UserProfile.findOneAndUpdate(
            { userId: decoded.userId },
            { $inc: { totalXP: achievement.pointsReward } },
            { returnDocument: 'after', upsert: true }
          )

          await XPHistory.create({
            userId: decoded.userId,
            xpPoints: achievement.pointsReward,
            sourceType: "achievement",
            sourceId: achievement._id,
          })
        } catch (awardError) {
          console.warn("Error awarding achievement:", awardError)
        }
      }
    }

    const finalProfile = await UserProfile.findOne({ userId: decoded.userId })

    if (finalProfile) {
      const stats = await Result.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(decoded.userId),
            status: "completed",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalTestsTaken: { $sum: 1 },
            averageAccuracy: { $avg: "$accuracy" },
          },
        },
      ])

      const leaderboardStats = stats[0] || {
        totalTestsTaken: 0,
        averageAccuracy: 0,
      }
      const finalLevel =
        finalProfile.level ??
        Math.max(1, Math.floor(finalProfile.totalXP / 500) + 1)

      await Leaderboard.findOneAndUpdate(
        { userId: decoded.userId },
        {
          $set: {
            totalXP: finalProfile.totalXP,
            level: finalLevel,
            totalTestsTaken: leaderboardStats.totalTestsTaken,
            averageAccuracy: Math.round(leaderboardStats.averageAccuracy || 0),
          },
        },
        { returnDocument: 'after', upsert: true }
      )

      const leaderboardDocs = await Leaderboard.find()
        .sort({ totalXP: -1, updatedAt: 1 })
        .select("_id rank")

      if (leaderboardDocs.length > 0) {
        const bulkOps = leaderboardDocs.map((doc, index) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { rank: index + 1 } },
          },
        }))

        await Leaderboard.bulkWrite(bulkOps)
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        nextLevel: newLevel > previousLevel ? newLevel : undefined,
        unlockedAchievements: awardedAchievements,
      },
    })
  } catch (error) {
    console.error("Submit result error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit result" },
      { status: 500 }
    )
  }
}
