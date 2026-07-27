import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IUserProfileDocument extends Document {
  userId: Types.ObjectId
  bio?: string
  avatarUrl?: string
  phone?: string
  dateOfBirth?: Date
  college?: string
  degree?: string
  specialization?: string
  location?: string
  resumeUrl?: string
  linkedinUrl?: string

  totalXP: number
  level: number

  currentStreak: number
  longestStreak: number
  lastActivityDate?: Date

  createdAt: Date
  updatedAt: Date
}

const UserProfileSchema = new Schema<IUserProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
    },
    dateOfBirth: {
      type: Date,
    },
    college: {
      type: String,
      trim: true,
      maxlength: [100, "College name cannot exceed 100 characters"],
    },
    degree: {
      type: String,
      trim: true,
      maxlength: [100, "Degree cannot exceed 100 characters"],
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: [100, "Specialization cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    linkedinUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
        "Please enter a valid LinkedIn URL",
      ],
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActivityDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const UserProfile: Model<IUserProfileDocument> =
  (mongoose.models.UserProfile as Model<IUserProfileDocument>) ||
  mongoose.model<IUserProfileDocument>("UserProfile", UserProfileSchema)

export default UserProfile
