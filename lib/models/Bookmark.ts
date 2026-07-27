import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IBookmarkDocument extends Document {
  userId: Types.ObjectId
  questionId: Types.ObjectId
  notes?: string
  createdAt: Date
}

const BookmarkSchema = new Schema<IBookmarkDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
)

BookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true })
BookmarkSchema.index({ userId: 1 })

const Bookmark: Model<IBookmarkDocument> =
  (mongoose.models.Bookmark as Model<IBookmarkDocument>) ||
  mongoose.model<IBookmarkDocument>("Bookmark", BookmarkSchema)

export default Bookmark
