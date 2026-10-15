import { v2 as cloudinary } from "cloudinary"
import { env } from "@/lib/env"

const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = env.CLOUDINARY_API_KEY
const apiSecret = env.CLOUDINARY_API_SECRET

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export const hasCloudinaryConfig = () => Boolean(cloudName && apiKey && apiSecret)

export default cloudinary
