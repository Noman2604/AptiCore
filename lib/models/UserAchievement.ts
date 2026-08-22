import mongoose, {
  Schema,
  Model,
  Document,
  Types,
} from "mongoose"
import "@/lib/models/Achievement" // Ensure Achievement schema is registered before populate



export interface IUserAchievementDocument
  extends Document {
  userId: Types.ObjectId
  achievementId: Types.ObjectId
  unlockedAt: Date
}

const UserAchievementSchema =
  new Schema<IUserAchievementDocument>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      achievementId: {
        type: Schema.Types.ObjectId,
        ref: "Achievement",
        required: true,
      },

      unlockedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  )

UserAchievementSchema.index(
  { userId: 1, achievementId: 1 },
  { unique: true }
)

UserAchievementSchema.index({
  userId: 1,
})

const UserAchievement: Model<IUserAchievementDocument> =
  (mongoose.models.UserAchievement as Model<IUserAchievementDocument>) ||
  mongoose.model<IUserAchievementDocument>(
    "UserAchievement",
    UserAchievementSchema
  )

export default UserAchievement
