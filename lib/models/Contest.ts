import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IContestDocument extends Document {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  categoryId: Types.ObjectId
  testId: Types.ObjectId
  maxParticipants?: number
  isActive: boolean
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ContestSchema = new Schema<IContestDocument>(
  {
    title: {
      type: String,
      required: [true, "Contest title is required"],
      trim: true,
      maxlength: [200, "Contest title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    testId: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    maxParticipants: {
      type: Number,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ContestSchema.index({ startTime: 1 })
ContestSchema.index({ categoryId: 1 })
ContestSchema.index({ isActive: 1 })

const Contest: Model<IContestDocument> =
  (mongoose.models.Contest as Model<IContestDocument>) ||
  mongoose.model<IContestDocument>("Contest", ContestSchema)

export default Contest
