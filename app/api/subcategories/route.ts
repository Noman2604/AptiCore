import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Subcategory from "@/lib/models/Subcategory"

export async function GET() {
  try {
    await connectDB()

    const subcategories = await Subcategory.find()
      .populate("categoryId", "name slug")
      .sort({ displayOrder: 1 })

    return NextResponse.json({
      success: true,
      data: subcategories,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subcategories",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const subcategory = await Subcategory.create(body)

    return NextResponse.json(
      {
        success: true,
        data: subcategory,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create subcategory",
      },
      { status: 500 }
    )
  }
}
