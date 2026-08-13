import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import mongoose from "mongoose"
import Test from "@/lib/models/Test"
import Category from "@/lib/models/Category"
import { verifyAccessToken } from "@/lib/jwt"

// GET /api/tests - List tests with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const adminOnly = searchParams.get("adminOnly") === "true"

    const query: Record<string, unknown> = { isPublished: true }

    if (category) {
      const isObjectId = mongoose.Types.ObjectId.isValid(category)
      if (isObjectId) {
        query.categoryId = category
      } else {
        const catDoc = await Category.findOne({ slug: category.toLowerCase().trim() }).select("_id")
        if (!catDoc) {
          return NextResponse.json({
            success: true,
            data: [],
            meta: { total: 0, limit, offset },
          })
        }
        query.categoryId = catDoc._id
      }
    }

    const total = await Test.countDocuments(query)
    
    let tests = await Test.find(query)
      .populate("categoryId", "name slug")
      .populate("createdBy", "name email role")
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Filter for admin-created tests if requested
    if (adminOnly) {
      tests = tests.filter((test: any) => {
        const creatorRole = test.createdBy?.role
        return creatorRole === "admin" || creatorRole === "super_admin"
      })
    }

    return NextResponse.json({
      success: true,
      data: tests,
      meta: { total, limit, offset },
    })
  } catch (error) {
    console.error("Get tests error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch tests" },
      { status: 500 }
    )
  }
}

// POST /api/tests - Create new test (admin only)
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
      title,
      description,
      categoryId,
      subcategoryId,
      questionIds,
      totalQuestions,
      totalMarks,
      durationMinutes,
      difficultyLevel,
    } = body

    if (
      !title ||
      !categoryId ||
      !totalQuestions ||
      !totalMarks ||
      !durationMinutes
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }
    const test = await Test.create({
      title,
      description,
      categoryId,
      subcategory: subcategoryId,
      questionIds: questionIds || [],
      totalQuestions,
      totalMarks,
      durationMinutes,
      difficultyLevel: difficultyLevel || "medium",
      isPublished: false,
      createdBy: decoded.userId,
    })

    await test.populate([
      { path: "categoryId", select: "name slug" },
      { path: "subcategory", select: "name slug" },
    ])

    return NextResponse.json({
      success: true,
      data: test,
    })
  } catch (error) {
    console.error("Create test error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create test" },
      { status: 500 }
    )
  }
}
