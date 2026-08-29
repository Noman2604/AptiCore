import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Subcategory from "@/lib/models/Subcategory"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()

  const { id } = await params

  const subcategory = await Subcategory.findById(id)

  if (!subcategory) {
    return NextResponse.json(
      { success: false, error: "Subcategory not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: subcategory,
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()

  const { id } = await params
  const body = await request.json()

  const updated = await Subcategory.findByIdAndUpdate(id, body, {
    returnDocument: 'after',
    runValidators: true,
  })

  return NextResponse.json({
    success: true,
    data: updated,
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()

  const { id } = await params

  await Subcategory.findByIdAndDelete(id)

  return NextResponse.json({
    success: true,
    message: "Subcategory deleted successfully",
  })
}
