import mongoose, { Schema, Model, Document, Types } from "mongoose"

export interface IContestRegistrationDocument extends Document {
  contestId: Types.ObjectId
  userId: Types.ObjectId
  rank?: number
  score?: number
  submittedAt?: Date
  createdAt: Date
}

const ContestRegistrationSchema = new Schema<IContestRegistrationDocument>(
  {
    contestId: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rank: {
      type: Number,
    },
    score: {
      type: Number,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

ContestRegistrationSchema.index({ contestId: 1, userId: 1 }, { unique: true })
ContestRegistrationSchema.index({ contestId: 1, rank: 1 })
ContestRegistrationSchema.index({ userId: 1 })

const ContestRegistration: Model<IContestRegistrationDocument> =
  (mongoose.models
    .ContestRegistration as Model<IContestRegistrationDocument>) ||
  mongoose.model<IContestRegistrationDocument>(
    "ContestRegistration",
    ContestRegistrationSchema
  )

export default ContestRegistration
