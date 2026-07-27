// app/api/auth/register/route.ts

import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/jwt"
import UserProfile, { IUserProfileDocument } from "@/lib/models/UserProfile"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, email, password, role } = await req.json()

    const existingUser = await User.findOne({
      email,
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists",
        },
        { status: 400 }
      )
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      isActive: true,
    })

    const profileData: Partial<IUserProfileDocument> = {
      userId: user._id,
      totalXP: 0,
      level: 1,
    }
    await UserProfile.create(profileData)

    const userIdString = user._id.toString()

    const accessToken = generateAccessToken({
      userId: userIdString,
      role: user.role,
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: {
        accessToken,
        user: user,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
      },
      { status: 500 }
    )
  }
}
