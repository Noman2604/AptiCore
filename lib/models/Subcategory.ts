import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface ISubcategoryDocument extends Document {
  categoryId: Types.ObjectId
  name: string
  slug: string
  description?: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const SubcategorySchema = new Schema<ISubcategoryDocument>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      maxlength: [100, "Subcategory name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Subcategory: Model<ISubcategoryDocument> =
  (mongoose.models.Subcategory as Model<ISubcategoryDocument>) ||
  mongoose.model<ISubcategoryDocument>("Subcategory", SubcategorySchema)

export default Subcategory
