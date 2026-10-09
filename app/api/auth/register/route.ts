// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import UserProfile, { IUserProfileDocument } from "@/lib/models/UserProfile"
import { generateVerificationData } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { logActivity } from "@/lib/audit"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rateLimit = checkRateLimit(`register:ip:${ip}`, 5, 10 * 60 * 1000)
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Registration limit reached for this IP. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      )
    }

    await connectDB()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and password are required",
        },
        { status: 400 }
      )
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
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

    const { otp, token, hashedOtp, hashedToken, expiresAt } =
      generateVerificationData()

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "user",
      isActive: true,
      isEmailVerified: false,
      verificationCode: hashedOtp,
      verificationToken: hashedToken,
      verificationExpires: expiresAt,
      lastVerificationResend: new Date(),
    })

    const profileData: Partial<IUserProfileDocument> = {
      userId: user._id,
      totalXP: 0,
      level: 1,
    }
    await UserProfile.create(profileData)

    // Send verification email
    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        otp,
        token,
      })
      console.log(`[AUTH:REGISTER] Verification email dispatched to ${user.email}`)
    } catch (mailError) {
      console.error("[AUTH:REGISTER] Failed to send verification email:", mailError)
      // We still proceed so the user is created and can click "Resend Code"
    }

    await logActivity({
      req,
      actorId: user._id,
      actorRole: user.role,
      actorName: user.name,
      actorEmail: user.email,
      action: "auth.register",
      module: "auth",
      status: "success",
      targetType: "user",
      targetId: user._id.toString(),
      targetLabel: user.email,
      details: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Account created! Please check your email to verify your account.",
      data: {
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    await logActivity({
      req,
      actorRole: "guest",
      action: "auth.register",
      module: "auth",
      status: "failure",
      targetType: "user",
      details: {
        error: error instanceof Error ? error.message : "Registration failed",
      },
    })

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed. Please try again.",
      },
      { status: 500 }
    )
  }
}
