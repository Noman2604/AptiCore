import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Question from "@/lib/models/Question"
import Category from "@/lib/models/Category"
import Subcategory from "@/lib/models/Subcategory"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/questions - List questions with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const subcategory = searchParams.get("subcategory")
    const difficulty = searchParams.get("difficulty")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const random = searchParams.get("random") === "true"
    const includeInactive = searchParams.get("includeInactive") === "true"

    if (includeInactive) {
      const accessToken = request.cookies.get("accessToken")?.value
      const decoded = accessToken ? verifyAccessToken(accessToken) : null

      if (!decoded) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        )
      }
    }

    const query: Record<string, unknown> = includeInactive
      ? {}
      : { isActive: true }

    if (category) {
      const cat = await Category.findOne({ slug: category })
      if (cat) {
        query.categoryId = cat._id
      }
    }

    if (subcategory) {
      const sub = await Subcategory.findOne({ slug: subcategory })
      if (sub) {
        query.subcategoryId = sub._id
      }
    }

    if (difficulty) {
      query.difficultyLevel = difficulty
    }

    const questionsQuery = Question.find(query)
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")
      .skip(offset)
      .limit(limit)

    if (random) {
      // Use aggregate for random sample
      const questions = await Question.aggregate([
        { $match: query },
        { $sample: { size: limit } },
      ])
      return NextResponse.json({
        success: true,
        data: questions,
        meta: { total: questions.length },
      })
    }

    const total = await Question.countDocuments(query)
    const questions = await questionsQuery.sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: questions,
      meta: { total, limit, offset },
    })
  } catch (error) {
    console.error("Get questions error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

// POST /api/questions - Create new question (admin only)
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
      categoryId,
      subcategoryId,
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      difficultyLevel,
      marks,
      negativeMarks,
      timeLimitSeconds,
    } = body

    if (!categoryId || !questionText || !correctAnswer) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const question = await Question.create({
      categoryId,
      subcategoryId,
      questionText,
      questionType: questionType || "mcq",
      options: options || [],
      correctAnswer,
      explanation,
      difficultyLevel: difficultyLevel || "medium",
      marks: marks || 1,
      negativeMarks: negativeMarks || 0.25,
      timeLimitSeconds: timeLimitSeconds || 60,
      createdBy: decoded.userId,
      isActive: true,
    })

    await question.populate("categoryId", "name slug")
    if (subcategoryId) {
      await question.populate("subcategoryId", "name slug")
    }

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("Create question error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create question" },
      { status: 500 }
    )
  }
}
