import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import XPHistory from "@/lib/models/XPHistory"
import { verifyAccessToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
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
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    const history = await XPHistory.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(100)

    return NextResponse.json({ success: true, data: history })
  } catch (error) {
    console.error("Get XP history error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch XP history" },
      { status: 500 }
    )
  }
}
