import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IResultAnswer {
  questionId: Types.ObjectId
  userAnswer: string
  isCorrect: boolean
  timeSpentSeconds: number
  isBookmarked: boolean
  markedForReview: boolean
}

export interface IResultDocument extends Document {
  userId: Types.ObjectId
  testId?: Types.ObjectId
  totalQuestions: number
  testName: string
  attemptedQuestions: number
  correctAnswers: number
  skippedQuestions: number
  accuracy: number
  marksObtained: number
  totalMarks: number
  timeSpentSeconds: number
  rank?: number
  percentile?: number
  status: "completed" | "abandoned" | "in_progress"
  answers: IResultAnswer[]
  startedAt: Date
  submittedAt?: Date
  createdAt: Date
}

type ResultStatus = "completed" | "abandoned" | "in_progress"

const ResultAnswerSchema = new Schema<IResultAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    markedForReview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
)

const ResultSchema = new Schema<IResultDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    attemptedQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    skippedQuestions: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    marksObtained: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
    },
    percentile: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["completed", "abandoned", "in_progress"] as ResultStatus[],
      default: "completed",
    },
    answers: [ResultAnswerSchema],
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Result: Model<IResultDocument> =
  (mongoose.models.Result as Model<IResultDocument>) ||
  mongoose.model<IResultDocument>("Result", ResultSchema)

export default Result
