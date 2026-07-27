import mongoose, { Schema, Model, Document } from "mongoose"

export interface ICategoryDocument extends Document {
  name: string
  slug: string
  description?: string
  iconUrl?: string
  colorCode?: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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
    iconUrl: {
      type: String,
      trim: true,
    },
    colorCode: {
      type: String,
      trim: true,
      match: [/^#[0-9A-Fa-f]{6}$/, "Color code must be a valid hex color"],
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

const Category: Model<ICategoryDocument> =
  (mongoose.models.Category as Model<ICategoryDocument>) ||
  mongoose.model<ICategoryDocument>("Category", CategorySchema)

export default Category
