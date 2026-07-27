// app/api/auth/login/route.ts

import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    const user = await User.findOne({
      email,
    }).select("+password")

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Email",
        },
        { status: 401 }
      )
    }

    const isValid = await user.comparePassword(password)

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Password",
        },
        { status: 401 }
      )
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      data: {
        user: user.toObject(),
      },
    })
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 }
    )
  }
}
