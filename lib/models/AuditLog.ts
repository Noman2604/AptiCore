import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IAuditLogDocument extends Document {
  adminId: Types.ObjectId
  actionType: "create" | "update" | "delete" | "ban" | "suspend"
  targetType: "user" | "question" | "test" | "category"
  targetId?: Types.ObjectId
  changes?: Record<string, unknown>
  ipAddress?: string
  createdAt: Date
}

type ActionType = "create" | "update" | "delete" | "ban" | "suspend"
type TargetType = "user" | "question" | "test" | "category"

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      enum: ["create", "update", "delete", "ban", "suspend"] as ActionType[],
      required: true,
    },
    targetType: {
      type: String,
      enum: ["user", "question", "test", "category"] as TargetType[],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)


const AuditLog: Model<IAuditLogDocument> =
  (mongoose.models.AuditLog as Model<IAuditLogDocument>) ||
  mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema)

export default AuditLog
