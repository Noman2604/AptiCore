import nodemailer from "nodemailer"

interface SendVerificationEmailOptions {
  to: string
  name: string
  otp: string
  token: string
}

const smtpPort = Number(process.env.SMTP_PORT) || 587
const isSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail({
  to,
  name,
  otp,
  token,
}: SendVerificationEmailOptions) {
  const baseUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"

  const verificationUrl = `${baseUrl}/auth/verify-email?email=${encodeURIComponent(
    to
  )}&token=${token}`

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your AptiCore Account</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #090d16;
          color: #e2e8f0;
          margin: 0;
          padding: 30px 15px;
        }
        .container {
          max-width: 560px;
          margin: 0 auto;
          background: #111827;
          border-radius: 16px;
          border: 1px solid #1f2937;
          padding: 40px 32px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #38bdf8;
          text-align: center;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }
        .logo span {
          color: #818cf8;
        }
        h1 {
          font-size: 22px;
          font-weight: 700;
          color: #f8fafc;
          text-align: center;
          margin: 0 0 16px;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          color: #94a3b8;
          margin: 0 0 20px;
        }
        .otp-box {
          background: #1e293b;
          border: 2px dashed #3b82f6;
          border-radius: 12px;
          padding: 18px;
          text-align: center;
          margin: 28px 0;
        }
        .otp-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .otp-code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #38bdf8;
          user-select: all;
        }
        .btn-wrapper {
          text-align: center;
          margin: 28px 0 20px;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          padding: 14px 32px;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
        }
        .divider {
          height: 1px;
          background: #1f2937;
          margin: 28px 0;
        }
        .footer {
          font-size: 12px;
          color: #64748b;
          text-align: center;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Apti<span>Core</span></div>
        <h1>Verify Your Email Address</h1>
        <p>Hi ${name || "there"},</p>
        <p>Welcome to <strong>AptiCore</strong>! Please verify your email address to activate your account and start practicing aptitude tests and contests.</p>
        
        <div class="otp-box">
          <div class="otp-label">Your 6-Digit Verification Code</div>
          <div class="otp-code">${otp}</div>
        </div>

        <p style="text-align: center; font-size: 14px; margin-bottom: 12px;">Or click the button below to verify automatically in one click:</p>
        
        <div class="btn-wrapper">
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
        </div>

        <p style="font-size: 13px; color: #64748b; text-align: center;">This code and link will expire in 24 hours.</p>

        <div class="divider"></div>

        <div class="footer">
          If you did not create an account on AptiCore, please disregard this email.<br/>
          &copy; ${new Date().getFullYear()} AptiCore. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: process.env.SMTP_FROM || `"AptiCore" <${process.env.SMTP_USER}>`,
    to,
    subject: `Verify your email for AptiCore - Code: ${otp}`,
    text: `Hi ${name},\n\nYour AptiCore verification code is: ${otp}\n\nAlternatively, verify using this link:\n${verificationUrl}\n\nThis link will expire in 24 hours.`,
    html,
  }

  // Always log OTP and verification link in console for rapid development/debugging
  console.log("\n==========================================")
  console.log(`📧 [EMAIL VERIFICATION] Sent to: ${to} (${name})`)
  console.log(`🔑 Verification OTP Code: ${otp}`)
  console.log(`🔗 One-Click URL: ${verificationUrl}`)
  console.log("==========================================\n")

  // If SMTP credentials are not configured yet, log warning and skip SMTP transport
  if (
    !process.env.SMTP_USER ||
    process.env.SMTP_USER === "your-email@example.com"
  ) {
    console.warn(`⚠️ [SMTP NOT CONFIGURED] Email simulated in terminal (no real email sent). Set SMTP credentials in .env.local to send real emails.\n`)
    return { simulated: true, otp, verificationUrl }
  }

  const result = await transporter.sendMail(mailOptions)
  console.log(`✅ [SMTP] Email delivered to ${to} (Message ID: ${result.messageId})`)
  return result
}
