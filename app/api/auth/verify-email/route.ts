// app/api/auth/verify-email/route.ts

import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateAccessToken } from "@/lib/jwt"
import { hashToken } from "@/lib/tokens"

export async function POST(req: Request) {
  try {
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
    console.log(`\n[AUTH:VERIFY] Attempting verification for: ${normalizedEmail} with ${otp ? `OTP: ${otp}` : `Token: ${token}`}`)

    // Find user including sensitive verification fields
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+verificationCode +verificationToken +verificationExpires"
    )

    if (!user) {
      console.warn(`[AUTH:VERIFY] User not found: ${normalizedEmail}`)
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email address",
        },
        { status: 404 }
      )
    }

    if (user.isEmailVerified) {
      console.log(`[AUTH:VERIFY] User already verified: ${normalizedEmail}`)
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
