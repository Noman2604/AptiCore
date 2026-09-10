// app/api/auth/resend-verification/route.ts

import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import { generateVerificationData } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

const RESEND_COOLDOWN_SECONDS = 60

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+lastVerificationResend"
    )

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with this email",
        },
        { status: 404 }
      )
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "This email address is already verified. You can log in.",
        },
        { status: 400 }
      )
    }

    // Check rate limit / cooldown
    if (user.lastVerificationResend) {
      const elapsedMs =
        Date.now() - new Date(user.lastVerificationResend).getTime()
      const cooldownMs = RESEND_COOLDOWN_SECONDS * 1000

      if (elapsedMs < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000)
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${remainingSeconds}s before requesting a new code.`,
            retryAfter: remainingSeconds,
          },
          { status: 429 }
        )
      }
    }

    console.log(`\n[AUTH:RESEND] Resending verification code for: ${normalizedEmail}`)

    const { otp, token, hashedOtp, hashedToken, expiresAt } =
      generateVerificationData()

    console.log(`[AUTH:RESEND] New OTP: ${otp} for ${normalizedEmail}`)

    user.verificationCode = hashedOtp
    user.verificationToken = hashedToken
    user.verificationExpires = expiresAt
    user.lastVerificationResend = new Date()
    await user.save()

    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        otp,
        token,
      })
      console.log(`[AUTH:RESEND] New verification email dispatched to ${user.email}`)
    } catch (mailError) {
      console.error("[AUTH:RESEND] Failed to resend verification email:", mailError)
    }

    return NextResponse.json({
      success: true,
      message: "A fresh verification code has been sent to your email.",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to resend verification code. Please try again.",
      },
      { status: 500 }
    )
  }
}
