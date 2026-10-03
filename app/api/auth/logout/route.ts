import { connectDB } from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import { logActivity } from "@/lib/audit"
import { getAuthUser } from "@/lib/auth-guard"

connectDB()

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)

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
    
    if (user) {
      await logActivity({
        req: request,
        actorId: user.userId,
        actorRole: user.role as any,
        action: "auth.logout",
        module: "auth",
        status: "success",
      })
    }

    return response
  } catch (error) {
    console.error("Logout error:", error)

    return NextResponse.json(
      { error: "An error occurred during logout." },
      { status: 500 }
    )
  }
}
