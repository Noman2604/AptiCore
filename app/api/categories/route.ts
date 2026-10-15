import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Category from "@/lib/models/Category"
import Subcategory from "@/lib/models/Subcategory"
import Question from "@/lib/models/Question"
import { apiSuccess, handleApiError, apiCreated, apiBadRequest } from "@/lib/api-response"

// GET Categories
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const categories = await Category.find({ isActive: true }).sort({
      displayOrder: 1,
      name: 1,
    })

    const subcategories = await Subcategory.find({ isActive: true }).sort({
      displayOrder: 1,
      name: 1,
    })
    const [catQuestionCounts, subQuestionCounts] = await Promise.all([
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      ]),
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$subcategoryId", count: { $sum: 1 } } },
      ]),
    ])

    const questionCountByCategory = new Map<string, number>()
    catQuestionCounts.forEach(({ _id, count }) => {
      if (_id) questionCountByCategory.set(String(_id), count)
    })

    const questionCountBySubcategory = new Map<string, number>()
    subQuestionCounts.forEach(({ _id, count }) => {
      if (_id) questionCountBySubcategory.set(String(_id), count)
    })

    const categoriesWithSubs = categories.map((cat) => ({
      ...cat.toObject(),
      questionCount: questionCountByCategory.get(cat._id.toString()) ?? 0,
      subcategories: subcategories
        .filter((sub) => sub.categoryId.toString() === cat._id.toString())
        .map((sub) => ({
          ...sub.toObject(),
          questionCount: questionCountBySubcategory.get(sub._id.toString()) ?? 0,
        })),
    }))

    return apiSuccess(categoriesWithSubs)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST Category
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const {
      name,
      slug,
      description,
      iconUrl,
      colorCode,
      displayOrder,
      isActive,
    } = body

    if (!name || !slug) {
      return apiBadRequest("Name and slug are required")
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    })

    if (existingCategory) {
      return apiBadRequest("Category with this name or slug already exists")
    }

    const category = await Category.create({
      name,
      slug,
      description,
      iconUrl,
      colorCode,
      displayOrder: displayOrder ?? 0,
      isActive: isActive ?? true,
    })

    const { logActivity } = await import("@/lib/audit")
    await logActivity({
      req: request,
      action: "category.create",
      module: "category",
      status: "success",
      targetType: "category",
      targetId: category._id.toString(),
      targetLabel: category.name,
      details: { name, slug },
    })

    return apiCreated(category)
  } catch (error) {
    return handleApiError(error)
  }
}
