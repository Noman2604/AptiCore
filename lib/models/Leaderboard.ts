import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface ILeaderboardDocument extends Document {
  userId: Types.ObjectId
  totalXP: number
  totalTestsTaken: number
  averageAccuracy: number
  rank: number
  level: number
  updatedAt: Date
}

const LeaderboardSchema = new Schema<ILeaderboardDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTestsTaken: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rank: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
)

const Leaderboard: Model<ILeaderboardDocument> =
  (mongoose.models.Leaderboard as Model<ILeaderboardDocument>) ||
  mongoose.model<ILeaderboardDocument>("Leaderboard", LeaderboardSchema)

export default Leaderboard
