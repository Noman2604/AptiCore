import mongoose, { Schema, Document, Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUserDocument extends Document {
  email: string
  name: string
  password: string
  role: "user" | "admin" | "super_admin"
  isActive: boolean
  isEmailVerified: boolean
  verificationCode?: string
  verificationToken?: string
  verificationExpires?: Date
  lastVerificationResend?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

type UserRole = "user" | "admin" | "super_admin"

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [30, "Name cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"] as UserRole[],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationExpires: {
      type: Date,
      select: false,
    },
    lastVerificationResend: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserSchema.pre("save", async function (this: IUserDocument) {
  if (!this.isModified("password")) {
    return
  }
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
  } catch (error) {
    console.error("Error hashing password:", error)
  }
})

const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema)

export default User
