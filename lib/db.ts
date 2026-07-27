import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI || " "

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var _mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
}
global._mongooseCache = cache

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (err) {
    cache.promise = null
    throw err
  }

  return cache.conn
}

export default connectDB
