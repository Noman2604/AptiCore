// app/api/auth/register/route.ts

import { NextResponse } from "next/server"
import User from "@/lib/models/user"
import { connectDB } from "@/lib/db"
import UserProfile, { IUserProfileDocument } from "@/lib/models/UserProfile"
import { generateVerificationData } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and password are required",
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

    console.log(`\n[AUTH:REGISTER] Registering new user: ${email} (${name})`)

    const { otp, token, hashedOtp, hashedToken, expiresAt } =
      generateVerificationData()

    console.log(`[AUTH:REGISTER] Generated OTP: ${otp} for ${email}`)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || "user",
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

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed. Please try again.",
      },
      { status: 500 }
    )
  }
}
