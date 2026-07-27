import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import Question from "@/lib/models/Question"
import Test from "@/lib/models/Test"

// GET /api/stats - Get landing page statistics
export async function GET() {
  try {
    await connectDB()

    const [totalUsers, totalQuestions, totalTests] = await Promise.all([
      User.countDocuments({ role: "user", isActive: true }),
      Question.countDocuments({ isActive: true }),
      Test.countDocuments({ isPublished: true }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalTests,
        companiesCovered: 85,
      },
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

