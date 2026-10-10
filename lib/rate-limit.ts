type RateLimitRecord = {
  count: number
  resetTime: number
}

// In-memory sliding window cache for rate limiting
const rateLimitMap = new Map<string, RateLimitRecord>()

// Periodically clean up expired records to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Checks whether an identifier has exceeded the rate limit.
 * @param identifier Unique key (e.g. IP, IP:action, email)
 * @param limit Maximum allowed attempts within the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (record.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000))
    return { success: false, remaining: 0, retryAfterSeconds }
  }

  record.count += 1
  return {
    success: true,
    remaining: limit - record.count,
    retryAfterSeconds: 0,
  }
}

/**
 * Extracts client IP address safely from request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return req.headers.get("x-real-ip") || "127.0.0.1"
}
