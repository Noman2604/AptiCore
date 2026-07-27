import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IAchievementDocument extends Document {
  name: string
  description?: string
  iconUrl?: string
  criteriaType: "score" | "streak" | "test_count" | "accuracy" | "time_spent"
  criteriaValue: number
  pointsReward: number
  rarity: "common" | "rare" | "epic" | "legendary"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

type CriteriaType =
  | "score"
  | "streak"
  | "test_count"
  | "accuracy"
  | "time_spent"

const AchievementSchema = new Schema<IAchievementDocument>(
  {
    name: {
      type: String,
      required: [true, "Achievement name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Achievement name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    iconUrl: {
      type: String,
      trim: true,
    },
    criteriaType: {
      type: String,
      enum: [
        "score",
        "streak",
        "test_count",
        "accuracy",
        "time_spent",
      ] as CriteriaType[],
      required: true,
    },
    criteriaValue: {
      type: Number,
      required: true,
      min: 0,
    },
    pointsReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Achievement: Model<IAchievementDocument> =
  (mongoose.models.Achievement as Model<IAchievementDocument>) ||
  mongoose.model<IAchievementDocument>("Achievement", AchievementSchema)

export default Achievement
