import mongoose, { Schema, Model, Document, Types } from "mongoose"

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "achievement"
  | "contest"
  | "streak"
  | "test"
  | "system"

export interface INotificationDocument extends Document {
  userId: Types.ObjectId
  title: string
  message: string
  type: NotificationType
  link?: string
  isRead: boolean
  readAt?: Date
  data?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: [
        "info",
        "success",
        "warning",
        "achievement",
        "contest",
        "streak",
        "test",
        "system",
      ],
      default: "info",
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })

const Notification: Model<INotificationDocument> =
  (mongoose.models.Notification as Model<INotificationDocument>) ||
  mongoose.model<INotificationDocument>("Notification", NotificationSchema)

export default Notification
