import { mkdir, writeFile } from "fs/promises"
import path from "path"

import cloudinary, { hasCloudinaryConfig } from "./cloudinary"
import streamifier from "streamifier"

export const uploadImage = async (
  buffer: Buffer,
  folder = "apticore"
): Promise<string> => {
  if (!hasCloudinaryConfig()) {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles")

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), buffer)

    return `/uploads/profiles/${fileName}`
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result?.secure_url) return reject(new Error("Cloudinary upload did not return a URL"))
        resolve(result.secure_url)
      }
    )

    streamifier.createReadStream(buffer).pipe(stream)
  })
}