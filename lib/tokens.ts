import crypto from "crypto"

export function generateVerificationData() {
  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString()

  // Generate 32-byte hex token for direct link
  const token = crypto.randomBytes(32).toString("hex")

  // Hash both with SHA-256 before storing in database
  const hashedOtp = hashToken(otp)
  const hashedToken = hashToken(token)

  // 24 hours expiry (default)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  return {
    otp,
    token,
    hashedOtp,
    hashedToken,
    expiresAt,
  }
}

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw.trim()).digest("hex")
}
