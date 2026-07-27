import mongoose, { Schema, Model, Document } from "mongoose"

export interface ISystemSettingsDocument extends Document {
  maintenanceMode: boolean
  signupAllowed: boolean
  leaderboardVisible: boolean
  xpMultiplier: number
  platformName: string
  defaultPassingScore: number
}

const SystemSettingsSchema = new Schema<ISystemSettingsDocument>(
  {
    maintenanceMode: { type: Boolean, default: false },
    signupAllowed: { type: Boolean, default: true },
    leaderboardVisible: { type: Boolean, default: true },
    xpMultiplier: { type: Number, default: 1.0 },
    platformName: { type: String, default: "AptiCore" },
    defaultPassingScore: { type: Number, default: 50 },
  },
  { timestamps: true }
)

const SystemSettings: Model<ISystemSettingsDocument> =
  (mongoose.models.SystemSettings as Model<ISystemSettingsDocument>) ||
  mongoose.model<ISystemSettingsDocument>("SystemSettings", SystemSettingsSchema)

export default SystemSettings
