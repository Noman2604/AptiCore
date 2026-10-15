import { NextResponse } from "next/server"
import { ZodError } from "zod"

export interface ApiPaginationMeta {
  total?: number
  limit?: number
  offset?: number
  page?: number
  totalPages?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  [key: string]: unknown
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: unknown
  meta?: ApiPaginationMeta
  timestamp: string
}

/**
 * Standard successful JSON response
 */
export function apiSuccess<T>(
  data: T,
  meta?: ApiPaginationMeta,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * Standard resource created response
 */
export function apiCreated<T>(
  data: T,
  meta?: ApiPaginationMeta
): NextResponse<ApiResponse<T>> {
  return apiSuccess(data, meta, 201)
}

/**
 * Standard error response
 */
export function apiError(
  errorMessage: string,
  status = 400,
  details?: unknown
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      message: errorMessage,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

/**
 * 400 Bad Request
 */
export function apiBadRequest(
  message = "Bad request",
  details?: unknown
): NextResponse<ApiResponse<null>> {
  return apiError(message, 400, details)
}

/**
 * 401 Unauthorized
 */
export function apiUnauthorized(
  message = "Authentication required"
): NextResponse<ApiResponse<null>> {
  return apiError(message, 401)
}

/**
 * 403 Forbidden
 */
export function apiForbidden(
  message = "You do not have permission to access this resource"
): NextResponse<ApiResponse<null>> {
  return apiError(message, 403)
}

/**
 * 404 Not Found
 */
export function apiNotFound(
  message = "Resource not found"
): NextResponse<ApiResponse<null>> {
  return apiError(message, 404)
}

/**
 * 500 Internal Server Error
 */
export function apiInternal(
  message = "An unexpected server error occurred"
): NextResponse<ApiResponse<null>> {
  return apiError(message, 500)
}

/**
 * Normalized error parser for Route Handlers
 */
export function handleApiError(err: unknown): NextResponse<ApiResponse<null>> {
  console.error("[API Error Handler]", err)

  // Zod validation errors
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }))
    return apiBadRequest("Validation failed", formattedIssues)
  }

  // Mongoose Duplicate Key Error (E11000)
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  ) {
    const keyPattern = (err as { keyPattern?: Record<string, number> }).keyPattern
    const field = keyPattern ? Object.keys(keyPattern)[0] : "field"
    return apiBadRequest(`A record with this ${field} already exists.`)
  }

  // Mongoose CastError / ValidationError
  if (
    err &&
    typeof err === "object" &&
    "name" in err &&
    ((err as { name: string }).name === "ValidationError" ||
      (err as { name: string }).name === "CastError")
  ) {
    return apiBadRequest(
      (err as { message?: string }).message || "Invalid database operation"
    )
  }

  // Generic standard error
  if (err instanceof Error) {
    return apiError(err.message, 500)
  }

  return apiInternal()
}

/**
 * Higher-order Route Handler wrapper for automatic error handling
 */
export function withErrorHandler<T = unknown>(
  handler: (req: Request, context?: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (req: Request, context?: any): Promise<NextResponse<ApiResponse<any>>> => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
