import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Category from "@/lib/models/Category"
import Subcategory from "@/lib/models/Subcategory"

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

    const categoriesWithSubs = categories.map((cat) => ({
      ...cat.toObject(),
      subcategories: subcategories.filter(
        (sub) => sub.categoryId.toString() === cat._id.toString()
      ),
    }))

    return NextResponse.json({
      success: true,
      data: categoriesWithSubs,
    })
  } catch (error) {
    console.error("Get categories error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    )
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
      return NextResponse.json(
        {
          success: false,
          error: "Name and slug are required",
        },
        { status: 400 }
      )
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    })

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category with this name or slug already exists",
        },
        { status: 409 }
      )
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

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create category error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
      },
      { status: 500 }
    )
  }
}
