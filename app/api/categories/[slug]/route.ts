import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Category from "@/lib/models/Category"
import Subcategory from "@/lib/models/Subcategory"

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()

    const { slug } = await context.params

    const category = await Category.findOne({
      slug,
      isActive: true,
    }).lean()

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        }
      )
    }

    const subcategories = await Subcategory.find({
      categoryId: category._id,
      isActive: true,
    })
      .sort({ displayOrder: 1, name: 1 })
      .lean()

    return NextResponse.json(
      {
        success: true,
        data: {
          ...category,
          subcategories,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    )
  }
}
