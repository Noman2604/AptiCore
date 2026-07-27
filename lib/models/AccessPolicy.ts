import mongoose, { Schema, Model, Document } from "mongoose"

export interface IAccessPolicyDocument extends Document {
  role: "user" | "admin" | "super_admin"
  permissions: string[]
}

const AccessPolicySchema = new Schema<IAccessPolicyDocument>({
  role: { type: String, required: true, unique: true },
  permissions: { type: [String], default: [] },
})

const AccessPolicy: Model<IAccessPolicyDocument> =
  (mongoose.models.AccessPolicy as Model<IAccessPolicyDocument>) ||
  mongoose.model<IAccessPolicyDocument>("AccessPolicy", AccessPolicySchema)

export default AccessPolicy
