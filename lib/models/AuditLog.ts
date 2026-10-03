import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IAuditLogDocument extends Document {
  actorId?: Types.ObjectId
  actorRole: "user" | "admin" | "super_admin" | "system" | "guest"
  actorName?: string
  actorEmail?: string
  action: string
  module: "auth" | "test" | "result" | "question" | "category" | "user" | "settings" | "feedback" | "report" | "achievement" | "bookmark" | "system"
  status: "success" | "failure"
  targetType?: string
  targetId?: string
  targetLabel?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    actorRole: {
      type: String,
      enum: ["user", "admin", "super_admin", "system", "guest"],
      required: true,
    },
    actorName: { type: String },
    actorEmail: { type: String },
    action: { type: String, required: true },
    module: {
      type: String,
      enum: [
        "auth",
        "test",
        "result",
        "question",
        "category",
        "user",
        "settings",
        "feedback",
        "report",
        "achievement",
        "bookmark",
        "system",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
    },
    targetType: { type: String },
    targetId: { type: String },
    targetLabel: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
)

AuditLogSchema.index({ createdAt: -1 })
AuditLogSchema.index({ actorId: 1, createdAt: -1 })
AuditLogSchema.index({ module: 1, action: 1 })

const AuditLog: Model<IAuditLogDocument> =
  (mongoose.models.AuditLog as Model<IAuditLogDocument>) ||
  mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema)

export default AuditLog
