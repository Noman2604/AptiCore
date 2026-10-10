// app/api/auth/verify-email/route.ts

import { NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/jwt"
import { hashToken } from "@/lib/tokens"
import { logActivity } from "@/lib/audit"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const ipLimit = checkRateLimit(`verify:ip:${ip}`, 15, 15 * 60 * 1000)
    if (!ipLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many verification attempts from this IP. Please try again in ${ipLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      )
    }

    await connectDB()

    const body = await req.json()
    const { email, otp, token } = body

    if (!email || (!otp && !token)) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and either an OTP code or verification token are required",
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Limit attempts per email to 5 per 15 minutes to prevent OTP brute-force
    const emailLimit = checkRateLimit(`verify:email:${normalizedEmail}`, 5, 15 * 60 * 1000)
    if (!emailLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many invalid attempts for this email. Please request a new code in ${emailLimit.retryAfterSeconds}s.`,
        },
        { status: 429 }
      )
    }

    // Find user including sensitive verification fields
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+verificationCode +verificationToken +verificationExpires"
    )

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email address",
        },
        { status: 404 }
      )
    }

    if (user.isEmailVerified) {
      // If already verified, grant session token if needed
      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        role: user.role,
      })

      const response = NextResponse.json({
        success: true,
        message: "Email is already verified",
        data: { user: user.toObject() },
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
    }

    // Check expiry
    if (!user.verificationExpires || user.verificationExpires < new Date()) {
      console.warn(`[AUTH:VERIFY] Code expired for user: ${normalizedEmail}`)
      return NextResponse.json(
        {
          success: false,
          error: "Verification code has expired. Please request a new code.",
          isExpired: true,
        },
        { status: 400 }
      )
    }

    // Validate OTP or Token
    let isMatch = false

    if (otp) {
      const hashedInputOtp = hashToken(otp)
      if (user.verificationCode && user.verificationCode === hashedInputOtp) {
        isMatch = true
      }
    }

    if (token && !isMatch) {
      const hashedInputToken = hashToken(token)
      if (
        user.verificationToken &&
        user.verificationToken === hashedInputToken
      ) {
        isMatch = true
      }
    }

    if (!isMatch) {
      console.warn(`[AUTH:VERIFY] Invalid OTP/Token attempt for: ${normalizedEmail}`)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification code or link. Please check and try again.",
        },
        { status: 400 }
      )
    }

    console.log(`✅ [AUTH:VERIFY] Verification SUCCESSFUL for: ${normalizedEmail}`)

    // Mark as verified and clear temporary fields
    user.isEmailVerified = true
    user.verificationCode = undefined
    user.verificationToken = undefined
    user.verificationExpires = undefined
    await user.save()

    await logActivity({
      req,
      actorId: user._id,
      actorRole: user.role,
      actorName: user.name,
      actorEmail: user.email,
      action: "auth.verify_email",
      module: "auth",
      status: "success",
      targetType: "user",
      targetId: user._id.toString(),
      targetLabel: user.email,
    })

    // Log the user in automatically
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: true,
        },
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
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed. Please try again.",
      },
      { status: 500 }
    )
  }
}
