import { NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

import { uploadImage } from "@/lib/uploadImage"
import connectDB from "@/lib/db"
import UserProfile from "@/lib/models/UserProfile"
import jwt from "jsonwebtoken"

interface JwtPayload {
  userId: string
}

async function getUserId(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value

  if (!token) {
    throw new Error("Unauthorized")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

  return decoded.userId
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const userId = await getUserId(request)

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${randomUUID()}-${file.name.replace(/\s+/g, "-")}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles")
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), buffer)

    const uploadedUrl = await uploadImage(buffer, "apticore/profile")

    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { avatarUrl: uploadedUrl } },
      { upsert: true, new: true, runValidators: true }
    )

    return NextResponse.json(
      {
        success: true,
        message: "Profile image uploaded successfully",
        data: { avatarUrl: uploadedUrl },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: "Profile image upload failed",
      },
      { status: 500 }
    )
  }
}
