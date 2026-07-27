// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get("accessToken")?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      role: string
    }

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    )
  }
}
