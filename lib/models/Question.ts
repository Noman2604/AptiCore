import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IQuestionOption {
  text: string
  order: number
  isCorrect: boolean
}

export interface IQuestionDocument extends Document {
  categoryId: Types.ObjectId
  subcategoryId?: Types.ObjectId
  questionText: string
  questionType:
    | "mcq"
    | "msq"
    | "true_false"
    | "fill_blank"
    | "numerical"
    | "coding"
  difficultyLevel: "easy" | "medium" | "hard"
  correctAnswer: string
  options?: IQuestionOption[]
  explanation?: string
  solutionVideoUrl?: string
  marks: number
  negativeMarks: number
  timeLimitSeconds: number
  isActive: boolean
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

type QuestionType =
  | "mcq"
  | "msq"
  | "true_false"
  | "fill_blank"
  | "numerical"
  | "coding"
type DifficultyLevel = "easy" | "medium" | "hard"

const QuestionOptionSchema = new Schema<IQuestionOption>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Option text cannot exceed 500 characters"],
    },
    order: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
)

const QuestionSchema = new Schema<IQuestionDocument>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    questionText: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    questionType: {
      type: String,
      enum: [
        "mcq",
        "msq",
        "true_false",
        "fill_blank",
        "numerical",
        "coding",
      ] as QuestionType[],
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"] as DifficultyLevel[],
      default: "medium",
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },
    options: [QuestionOptionSchema],
    explanation: {
      type: String,
      trim: true,
      required: [true, "Explanation is required"],
      maxlength: [2000, "Explanation cannot exceed 2000 characters"],
    },
    solutionVideoUrl: {
      type: String,
      trim: true,
    },
    marks: {
      type: Number,
      default: 4,
      min: [1, "Marks must be at least 1"],
    },
    negativeMarks: {
      type: Number,
      default: 1,
      min: [1, "Negative marks cannot be negative"],
    },
    timeLimitSeconds: {
      type: Number,
      default: 30,
      min: [15, "Time limit must be at least 15 seconds"],
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

const Question: Model<IQuestionDocument> =
  (mongoose.models.Question as Model<IQuestionDocument>) ||
  mongoose.model<IQuestionDocument>("Question", QuestionSchema)

export default Question
