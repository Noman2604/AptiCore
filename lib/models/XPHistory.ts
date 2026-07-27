import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IXPHistoryDocument extends Document {
  userId: Types.ObjectId
  xpPoints: number
  sourceType:
    | "test_completion"
    | "correct_answer"
    | "achievement"
    | "streak"
    | "bonus"
  sourceId?: Types.ObjectId
  createdAt: Date
}

type XPSourceType =
  | "test_completion"
  | "correct_answer"
  | "achievement"
  | "streak"
  | "bonus"

const XPHistorySchema = new Schema<IXPHistoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    xpPoints: {
      type: Number,
      required: true,
    },
    sourceType: {
      type: String,
      enum: [
        "test_completion",
        "correct_answer",
        "achievement",
        "streak",
        "bonus",
      ] as XPSourceType[],
      required: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
)

const XPHistory: Model<IXPHistoryDocument> =
  (mongoose.models.XPHistory as Model<IXPHistoryDocument>) ||
  mongoose.model<IXPHistoryDocument>("XPHistory", XPHistorySchema)

export default XPHistory
