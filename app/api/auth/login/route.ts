// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/jwt"
import { logActivity } from "@/lib/audit"

export async function POST(req: NextRequest) {
  let email = ""
  try {
    await connectDB()

    const body = await req.json()
    email = body.email
    const password = body.password

    const user = await User.findOne({
      email,
    }).select("+password")

    if (!user) {
      await logActivity({
        req,
        action: "auth.login",
        module: "auth",
        status: "failure",
        details: { reason: "Invalid Email", email },
      })
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
      await logActivity({
        req,
        actorId: user._id,
        actorRole: user.role,
        actorName: user.name,
        actorEmail: user.email,
        action: "auth.login",
        module: "auth",
        status: "failure",
        details: { reason: "Invalid Password", email },
      })
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Password",
        },
        { status: 401 }
      )
    }

    if (!user.isEmailVerified) {
      await logActivity({
        req,
        actorId: user._id,
        actorRole: user.role,
        actorName: user.name,
        actorEmail: user.email,
        action: "auth.login",
        module: "auth",
        status: "failure",
        details: { reason: "Unverified Email", email },
      })
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email address before logging in.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      )
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    })

    await logActivity({
      req,
      actorId: user._id,
      actorRole: user.role,
      actorName: user.name,
      actorEmail: user.email,
      action: "auth.login",
      module: "auth",
      status: "success",
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
  } catch (err: any) {
    await logActivity({
      req,
      action: "auth.login",
      module: "auth",
      status: "failure",
      details: { reason: "Server Error", error: err.message, email },
    })
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 }
    )
  }
}
