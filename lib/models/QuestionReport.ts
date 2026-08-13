import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IQuestionReportDocument extends Document {
  questionId: Types.ObjectId
  userId: Types.ObjectId
  message: string
  reason:
    | "wrong_answer"
    | "incorrect_question"
    | "typo"
    | "duplicate"
    | "outdated"
    | "other"
  isResolved: boolean | null
  resolvedBy?: Types.ObjectId | null
  resolvedAt?: Date | null
  adminRemark?: string | null
  createdAt: Date
  updatedAt: Date
}

type ReportReason =
  | "wrong_answer"
  | "incorrect_question"
  | "typo"
  | "duplicate"
  | "outdated"
  | "other"

const QuestionReportSchema = new Schema<IQuestionReportDocument>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    reason: {
      type: String,
      enum: [
        "wrong_answer",
        "incorrect_question",
        "typo",
        "duplicate",
        "outdated",
        "other",
      ] as ReportReason[],
      default: "other",
    },
    isResolved: {
      type: Boolean,
      default: null,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    adminRemark: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const QuestionReport: Model<IQuestionReportDocument> =
  (mongoose.models.QuestionReport as Model<IQuestionReportDocument>) ||
  mongoose.model<IQuestionReportDocument>("QuestionReport", QuestionReportSchema)

export default QuestionReport
