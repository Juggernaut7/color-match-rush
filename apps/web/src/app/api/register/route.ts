import { connectDB } from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  address: z.string().min(1),
  username: z.string().min(1).max(20),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, username } = registerSchema.parse(body)

    const db = await connectDB()
    const usersCollection = db.collection("users")

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username })
    if (existingUser) {
      return Response.json({ error: "Username already taken" }, { status: 400 })
    }

    // Check if address already registered
    const existingAddress = await usersCollection.findOne({ address })
    if (existingAddress) {
      return Response.json({ error: "Address already registered" }, { status: 400 })
    }

    // Hash username for storage
    const hashedUsername = await hash(username, 10)

    // Create new user
    const result = await usersCollection.insertOne({
      address,
      username,
      hashedUsername,
      createdAt: new Date(),
    })

    return Response.json({ success: true, userId: result.insertedId })
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Registration failed" }, { status: 500 })
  }
}

