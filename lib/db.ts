import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const MONGODB_URI = process.env.MONGODB_URI || ''

function getMongoUri() {
  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local')
  }
  return MONGODB_URI
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
