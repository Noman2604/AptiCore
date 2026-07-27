import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

import connectDB from "@/lib/db"
import UserProfile from "@/lib/models/UserProfile"

interface JwtPayload {
  userId: string
}

async function getUserId(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value

  if (!token) {
    throw new Error("Unauthorized")
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

  return decoded.userId
}

function profilePayload(body: any) {
  return {
    bio: body.bio,
    phone: body.phone,
    dateOfBirth: body.dateOfBirth,
    college: body.college,
    degree: body.degree,
    specialization: body.specialization,
    location: body.location,
    avatarUrl: body.avatarUrl || " ",
    linkedinUrl: body.linkedinUrl || " ",
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = await getUserId(request)

    const profile = await UserProfile.findOne({
      userId,
    })

    return NextResponse.json(
      {
        success: true,
        data: profile,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch profile",
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()

    const userId = await getUserId(request)

    const {
      bio,
      phone,
      dateOfBirth,
      college,
      degree,
      specialization,
      location,
      avatarUrl,
      linkedinUrl,
    } = await request.json()

    const profile = await UserProfile.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: profilePayload({
          bio,
          phone,
          dateOfBirth,
          college,
          degree,
          specialization,
          location,
          avatarUrl,
          linkedinUrl,
        }),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: profile,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Profile update failed",
      },
      {
        status: 500,
      }
    )
  }
}
