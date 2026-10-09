// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/jwt"
import { logActivity } from "@/lib/audit"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  let email = ""
  try {
    const ip = getClientIp(req)
    const ipLimit = checkRateLimit(`login:ip:${ip}`, 20, 60 * 1000)
    if (!ipLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts from this IP. Please try again in ${ipLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      )
    }

    await connectDB()

    const body = await req.json()
    email = typeof body.email === "string" ? body.email.toLowerCase().trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      )
    }

    const accountLimit = checkRateLimit(`login:account:${email}`, 5, 60 * 1000)
    if (!accountLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts for this account. Please wait ${accountLimit.retryAfterSeconds}s.`,
        },
        { status: 429 }
      )
    }

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

    const sanitizedUser = user.toObject() as any
    delete sanitizedUser.password
    delete sanitizedUser.verificationCode
    delete sanitizedUser.verificationToken

    const response = NextResponse.json({
      success: true,
      data: {
        user: sanitizedUser,
      },
    })
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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
