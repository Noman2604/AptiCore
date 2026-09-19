import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IEducation {
  level:
    | "SSC"
    | "HSC"
    | "Diploma"
    | "Graduation"
    | "Post Graduation"
    | "PhD"
    | "Certification"

  status: "Pursuing" | "Completed" | "Dropped"

  institutionName: string
  universityOrBoard?: string

  degree?: string
  specialization?: string
  stream?: string
  medium?: string

  cgpa?: number
  percentage?: number

  startYear?: number
  endYear?: number
  passingYear?: number

  currentlyStudying?: boolean
}

export interface IUserProfileDocument extends Document {
  userId: Types.ObjectId

  bio?: string
  avatarUrl?: string
  avatarBorder?: string
  phone?: string
  dateOfBirth?: Date
  location?: string

  resumeUrl?: string
  linkedinUrl?: string

  education: IEducation[]

  totalXP: number
  level: number

  currentStreak: number
  longestStreak: number
  lastActivityDate?: Date

  createdAt: Date
  updatedAt: Date
}

const EducationSchema = new Schema<IEducation>(
  {
    level: {
      type: String,
      enum: [
        "SSC",
        "HSC",
        "Diploma",
        "Graduation",
        "Post Graduation",
        "PhD",
        "Certification",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pursuing", "Completed", "Dropped"],
      default: "Completed",
    },

    institutionName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    universityOrBoard: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    degree: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    specialization: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    stream: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    medium: {
      type: String,
      enum: [
        "English",
        "Hindi",
        "Marathi",
        "Gujarati",
        "Urdu",
        "Tamil",
        "Telugu",
        "Kannada",
        "Malayalam",
        "Other",
      ],
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    startYear: {
      type: Number,
      min: 1950,
    },

    endYear: {
      type: Number,
      min: 1950,
    },

    passingYear: {
      type: Number,
      min: 1950,
    },

    currentlyStudying: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
)

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
      maxlength: 500,
    },
    avatarUrl: String,
    avatarBorder: {
      type: String,
      default: "basic",
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
    },

    dateOfBirth: Date,

    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    resumeUrl: String,
    linkedinUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
        "Please enter a valid LinkedIn URL",
      ],
    },
    education: {
      type: [EducationSchema],
      default: [],
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
    lastActivityDate: Date,
  },
  {
    timestamps: true,
  }
)

if (mongoose.models.UserProfile && !mongoose.models.UserProfile.schema.paths.avatarBorder) {
  delete (mongoose.models as any).UserProfile
}

const UserProfile: Model<IUserProfileDocument> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfileDocument>("UserProfile", UserProfileSchema)

export default UserProfile