import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IReportDocument extends Document {
  reportedBy: Types.ObjectId
  reportType: "question" | "user" | "content"
  targetId: Types.ObjectId
  reason: string
  status: "pending" | "resolved" | "rejected"
  adminNotes?: string
  createdAt: Date
  resolvedAt?: Date
}

type ReportType = "question" | "user" | "content"
type ReportStatus = "pending" | "resolved" | "rejected"

const ReportSchema = new Schema<IReportDocument>(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["question", "user", "content"] as ReportType[],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Reason cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"] as ReportStatus[],
      default: "pending",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Report: Model<IReportDocument> =
  (mongoose.models.Report as Model<IReportDocument>) ||
  mongoose.model<IReportDocument>("Report", ReportSchema)

export default Report
