import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"

interface JwtPayload {
  userId: string
  role: "user" | "admin" | "super_admin"
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  const { pathname } = req.nextUrl

  const authRoutes = ["/", "/auth/login", "/auth/register"]

  // User already logged in
  if (token) {
    const verified = verifyAccessToken(token)
    if (verified && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // CSRF validation on mutating API requests
  if (pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.headers.get("origin")
    if (origin) {
      try {
        const originHost = new URL(origin).host
        const reqHost = req.headers.get("host")
        if (reqHost && originHost !== reqHost) {
          return NextResponse.json(
            { success: false, error: "Cross-site request forgery blocked" },
            { status: 403 }
          )
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid origin header" },
          { status: 403 }
        )
      }
    }
  }

  // API Protected Routes
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/super-admin")) {
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const decodedApi = verifyAccessToken(token)
    if (!decodedApi) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
    }
    if (pathname.startsWith("/api/super-admin") && decodedApi.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Super Admin required" },
        { status: 403 }
      )
    }
    if (pathname.startsWith("/api/admin") && !["admin", "super_admin"].includes(decodedApi.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin required" },
        { status: 403 }
      )
    }
    return NextResponse.next()
  }

  // Protected Page Routes
  const protectedRoutes = ["/dashboard", "/admin", "/super-admin"]

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (!token) {
    return NextResponse.next()
  }

  const decoded = verifyAccessToken(token)
  if (!decoded) {
    const response = NextResponse.redirect(new URL("/auth/login", req.url))
    response.cookies.delete("accessToken")
    return response
  }

  try {
    // Admin Only
    const role = decoded.role

    // USER restrictions
    if (role === "user") {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/super-admin")
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    if(role === "super_admin") {
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/super-admin", req.url))
      }
    } 

    // ADMIN restrictions
    if (role === "admin") {
      if (pathname.startsWith("/super-admin")) {
        return NextResponse.redirect(new URL("/admin", req.url))
      }

      // ❌ admin cannot access dashboard
      if (pathname.startsWith("/dashboard") ) {
        return NextResponse.redirect(new URL("/admin", req.url))

      }
    }

    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Super Admin Only
    if (pathname.startsWith("/super-admin") && decoded.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", req.url))

    response.cookies.delete("accessToken")

    return response
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",

    "/dashboard/:path*",
    "/admin/:path*",
    "/super-admin/:path*",

    "/api/admin/:path*",
    "/api/super-admin/:path*",
  ],
}
