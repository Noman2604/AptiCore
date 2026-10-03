import { NextRequest, NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import Result from "@/lib/models/Result"
import "@/lib/models/Test"
import "@/lib/models/Category"
import "@/lib/models/Subcategory"

function isAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null

  return decoded?.role === "admin" || decoded?.role === "super_admin"
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number(searchParams.get("limit") || "200")
    const offset = Number(searchParams.get("offset") || "0")

    const query: Record<string, unknown> = {}
    if (status && status !== "all") {
      query.status = status
    }

    const total = await Result.countDocuments(query)
    const results = await Result.find(query)
      .populate("userId", "name email")
      .populate({
        path: "testId",
        select: "title totalQuestions totalMarks durationMinutes categoryId subcategory",
        populate: [
          { path: "categoryId", select: "name" },
          { path: "subcategory", select: "name" },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean()

    const data = results.map((result) => {
      const populatedTest = result.testId as any
      const catName = populatedTest?.categoryId?.name
      const subName = populatedTest?.subcategory?.name

      let formattedTitle = ""
      if (catName && subName) {
        const cleanCat = catName.replace(/\s+Test$/i, "")
        formattedTitle = `${cleanCat} — ${subName} Test`
      } else if (subName) {
        formattedTitle = `${subName} Test`
      } else if (catName) {
        formattedTitle = `${catName} Practice Test`
      }

      const rawTestName = result.testName?.trim()
      const isGenericName =
        !rawTestName ||
        rawTestName.toLowerCase() === "practice session" ||
        rawTestName.toLowerCase() === "practice session "

      const resolvedTitle =
        formattedTitle ||
        (!isGenericName ? rawTestName : null) ||
        (populatedTest?.title && !populatedTest.title.toLowerCase().startsWith("practice session")
          ? populatedTest.title
          : null) ||
        rawTestName ||
        populatedTest?.title ||
        "Practice Test"

      return {
        ...result,
        _id: result._id.toString(),
        userId: result.userId
          ? {
              _id: (result.userId as any)._id.toString(),
              name: (result.userId as any).name,
              email: (result.userId as any).email,
            }
          : null,
        testId: populatedTest
          ? {
              _id: populatedTest._id.toString(),
              title: resolvedTitle,
              category: catName || null,
              subcategory: subName || null,
            }
          : null,
        testName: resolvedTitle,
        startedAt: result.startedAt?.toISOString(),
        submittedAt: result.submittedAt?.toISOString(),
        createdAt: result.createdAt?.toISOString(),
      }
    })

    return NextResponse.json({
      success: true,
      data,
      meta: { total, offset, limit },
    })
  } catch (error) {
    console.error("Get admin results error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch results" },
      { status: 500 }
    )
  }
}
