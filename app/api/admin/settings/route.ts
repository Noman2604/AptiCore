import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import SystemSettings from "@/lib/models/SystemSettings"

function isSuperAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role === "super_admin"
}

export async function GET(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    let settings = await SystemSettings.findOne().lean()
    if (!settings) {
      // Create defaults
      const defaults = await SystemSettings.create({})
      settings = defaults.toObject()
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error("Get system settings error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()
    const {
      maintenanceMode,
      signupAllowed,
      leaderboardVisible,
      xpMultiplier,
      platformName,
      defaultPassingScore,
    } = body

    const updated = await SystemSettings.findOneAndUpdate(
      {},
      {
        $set: {
          maintenanceMode,
          signupAllowed,
          leaderboardVisible,
          xpMultiplier: Number(xpMultiplier ?? 1.0),
          platformName: platformName || "AptiCore",
          defaultPassingScore: Number(defaultPassingScore ?? 50),
        },
      },
      { returnDocument: 'after', upsert: true }
    )

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Update system settings error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
