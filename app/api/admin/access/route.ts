import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { verifyAccessToken } from "@/lib/jwt"
import AccessPolicy from "@/lib/models/AccessPolicy"

function isSuperAdmin(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const decoded = accessToken ? verifyAccessToken(accessToken) : null
  return decoded?.role === "super_admin"
}

const defaultPolicies = [
  {
    role: "user",
    permissions: ["take_tests", "view_leaderboard", "view_achievements"],
  },
  {
    role: "admin",
    permissions: [
      "take_tests",
      "view_leaderboard",
      "view_achievements",
      "manage_questions",
      "manage_tests",
      "manage_categories",
      "view_reports",
      "view_results",
    ],
  },
  {
    role: "super_admin",
    permissions: [
      "take_tests",
      "view_leaderboard",
      "view_achievements",
      "manage_questions",
      "manage_tests",
      "manage_categories",
      "view_reports",
      "view_results",
      "manage_admins",
      "view_logs",
      "configure_system",
      "manage_roles",
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    let policies = await AccessPolicy.find().lean()
    if (!policies.length) {
      // Seed default policies
      await AccessPolicy.insertMany(defaultPolicies)
      policies = await AccessPolicy.find().lean()
    }

    return NextResponse.json({
      success: true,
      data: policies,
    })
  } catch (error) {
    console.error("Get access policies error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch access policies" },
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
    const { role, permissions } = body

    if (!role || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: "Role and permissions array are required" },
        { status: 400 }
      )
    }

    const updated = await AccessPolicy.findOneAndUpdate(
      { role },
      { $set: { permissions } },
      { returnDocument: 'after', upsert: true }
    )

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Update access policy error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update access policy" },
      { status: 500 }
    )
  }
}
