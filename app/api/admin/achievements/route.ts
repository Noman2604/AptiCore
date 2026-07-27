import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Achievement from "@/lib/models/Achievement"
import { verifyAccessToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const accessToken = request.cookies.get("accessToken")?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const decoded = verifyAccessToken(accessToken)

    if (
      !decoded ||
      (decoded.role !== "admin" && decoded.role !== "super_admin")
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      )
    }

    const {
      name,
      description,
      iconUrl,
      criteriaType,
      criteriaValue,
      pointsReward,
      rarity,
      isActive,
    } = await request.json()

    const existingAchievement = await Achievement.findOne({
      name,
    })

    if (existingAchievement) {
      return NextResponse.json(
        {
          success: false,
          error: "Achievement already exists",
        },
        { status: 409 }
      )
    }

    const achievement = await Achievement.create({
      name,
      description,
      iconUrl,
      criteriaType,
      criteriaValue,
      pointsReward,
      rarity,
      isActive,
    })

    return NextResponse.json(
      {
        success: true,
        data: achievement,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create achievement error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create achievement",
      },
      { status: 500 }
    )
  }
}
