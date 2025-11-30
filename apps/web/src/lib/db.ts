import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectDB() {
  if (cachedDb) {
    return cachedDb
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not defined")
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db("color-match-rush")
  cachedClient = client
  cachedDb = db

  return db
}

