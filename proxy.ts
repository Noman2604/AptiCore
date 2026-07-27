import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

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
    try {
      jwt.verify(token, process.env.JWT_SECRET!)

      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    } catch {
      // Invalid token
    }
  }

  // Protected Routes
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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

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
  ],
}
