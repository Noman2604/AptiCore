import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface ITestQuestion {
  questionId: Types.ObjectId
  sectionNumber: number
  questionOrder: number
  marks: number
}

export interface ITestDocument extends Document {
  title: string
  description?: string
  categoryId: Types.ObjectId
  subcategory: Types.ObjectId
  sessionType?: "mixed" | "subcategory"
  questionIds: ITestQuestion[]
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
  sectionWiseTimer: boolean
  negativeMarking: boolean
  randomizeQuestions: boolean
  randomizeOptions: boolean
  adaptiveDifficulty: boolean
  difficultyLevel: "easy" | "medium" | "hard"
  isPublished: boolean
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

type DifficultyLevel = "easy" | "medium" | "hard"

const TestQuestionSchema = new Schema<ITestQuestion>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    sectionNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    questionOrder: {
      type: Number,
      required: true,
    },
    marks: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
)

const TestSchema = new Schema<ITestDocument>(
  {
    title: {
      type: String,
      required: [true, "Test title is required"],
      trim: true,
      maxlength: [200, "Test title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    sessionType: {
      type: String,
      enum: ["mixed", "subcategory"],
      default: "subcategory",
    },
    questionIds: [TestQuestionSchema],
    totalQuestions: {
      type: Number,
      required: true,
      min: [1, "Test must have at least 1 question"],
    },
    totalMarks: {
      type: Number,
      required: true,
      min: [1, "Total marks must be at least 1"],
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: [1, "Duration must be at least 1 minute"],
    },
    sectionWiseTimer: {
      type: Boolean,
      default: false,
    },
    negativeMarking: {
      type: Boolean,
      default: true,
    },
    randomizeQuestions: {
      type: Boolean,
      default: true,
    },
    randomizeOptions: {
      type: Boolean,
      default: true,
    },
    adaptiveDifficulty: {
      type: Boolean,
      default: false,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"] as DifficultyLevel[],
      default: "medium",
    },
    isPublished: {
      type: Boolean,
      default: false,
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

const Test: Model<ITestDocument> =
  (mongoose.models.Test as Model<ITestDocument>) ||
  mongoose.model<ITestDocument>("Test", TestSchema)

export default Test
