import { connectDB } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"

connectDB()

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("accessToken")?.value

    const response = NextResponse.json({
      message: "Logout successful.",
      success: true,
    })

    // clear correct cookie
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)

    return NextResponse.json(
      { error: "An error occurred during logout." },
      { status: 500 }
    )
  }
}
