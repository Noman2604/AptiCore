import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IFeedbackDocument extends Document {
  userId: Types.ObjectId
  feedbackType: "feedback" | "comment"
  targetType: "question" | "test" | "result" | "page" | "platform"
  targetId?: Types.ObjectId | null
  parentFeedbackId?: Types.ObjectId | null
  title?: string
  content: string
  rating?: number
  sentiment?: "positive" | "neutral" | "negative"
  isAnonymous: boolean
  isPublic: boolean
  status: "pending" | "published" | "hidden" | "resolved"
  adminNotes?: string
  resolvedAt?: Date
  resolvedBy?: Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

type FeedbackType = "feedback" | "comment"
type TargetType = "question" | "test" | "result" | "page" | "platform"
type FeedbackStatus = "pending" | "published" | "hidden" | "resolved"
type FeedbackSentiment = "positive" | "neutral" | "negative"

const FeedbackSchema = new Schema<IFeedbackDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedbackType: {
      type: String,
      enum: ["feedback", "comment"] as FeedbackType[],
      default: "feedback",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["question", "test", "result", "page", "platform"] as TargetType[],
      default: "platform",
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      refPath: "targetType",
      default: null,
    },
    parentFeedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      default: null,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content cannot be empty"],
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"] as FeedbackSentiment[],
      default: "neutral",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "published", "hidden", "resolved"] as FeedbackStatus[],
      default: "published",
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

FeedbackSchema.index({ targetType: 1, targetId: 1, createdAt: -1 })
FeedbackSchema.index({ userId: 1, createdAt: -1 })
FeedbackSchema.index({ parentFeedbackId: 1, createdAt: 1 })
FeedbackSchema.index({ status: 1, targetType: 1 })

const Feedback: Model<IFeedbackDocument> =
  (mongoose.models.Feedback as Model<IFeedbackDocument>) ||
  mongoose.model<IFeedbackDocument>("Feedback", FeedbackSchema)

export default Feedback
