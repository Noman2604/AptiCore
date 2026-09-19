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
  const payload: Record<string, unknown> = {}

  if (body.bio !== undefined) payload.bio = body.bio
  if (body.phone !== undefined) payload.phone = body.phone
  if (body.dateOfBirth !== undefined) payload.dateOfBirth = body.dateOfBirth
  if (body.location !== undefined) payload.location = body.location
  if (body.avatarUrl !== undefined) payload.avatarUrl = body.avatarUrl || ""
  if (body.avatarBorder !== undefined) payload.avatarBorder = body.avatarBorder || "basic"
  if (body.resumeUrl !== undefined) payload.resumeUrl = body.resumeUrl || ""
  if (body.linkedinUrl !== undefined) payload.linkedinUrl = body.linkedinUrl || undefined

  if (Array.isArray(body.education) && body.education.length > 0) {
    payload.education = body.education.map((item: any) => ({
      level: item.level || "Graduation",
      status: item.status || "Completed",
      institutionName: item.institutionName || item.college || "",
      degree: item.degree,
      specialization: item.specialization,
      universityOrBoard: item.universityOrBoard,
      stream: item.stream,
      medium: item.medium,
      cgpa: item.cgpa,
      percentage: item.percentage,
      startYear: item.startYear,
      endYear: item.endYear,
      passingYear: item.passingYear,
      currentlyStudying: item.currentlyStudying,
    }))
  } else if (body.education !== undefined) {
    const educationProvided = body.college || body.degree || body.specialization

    if (educationProvided) {
      payload.education = [
        {
          level: body.level || "Graduation",
          status: body.status || "Completed",
          institutionName: body.college || "",
          degree: body.degree || "",
          specialization: body.specialization || "",
          universityOrBoard: body.universityOrBoard || "",
          stream: body.stream || "",
          medium: body.medium || "",
          cgpa: body.cgpa || undefined,
          percentage: body.percentage || undefined,
          startYear: body.startYear || undefined,
          endYear: body.endYear || undefined,
          passingYear: body.passingYear || undefined,
          currentlyStudying: body.currentlyStudying || false,
        },
      ]
    }
  }

  return payload
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

    const body = await request.json()

    const profile = await UserProfile.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: profilePayload(body),
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: false,
      }
    )

    console.log("Updated profile:", profile)

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
    console.error("Profile update error:", error)

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
