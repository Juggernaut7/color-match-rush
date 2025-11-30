import { connectDB } from "@/lib/db"
import { getCurrentRound } from "@/lib/utils/getCurrentRound"
import { z } from "zod"
import { NextRequest } from "next/server"

const joinRoundSchema = z.object({
  address: z.string().min(1),
  txHash: z.string().min(1),
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const address = searchParams.get("check")
    const roundId = searchParams.get("roundId")

    if (!address || !roundId) {
      return Response.json({ hasJoined: false })
    }

    const db = await connectDB()
    const entriesCollection = db.collection("entries")
    const entry = await entriesCollection.findOne({
      roundId,
      address: address.toLowerCase(),
    })

    return Response.json({ hasJoined: !!entry })
  } catch (error) {
    console.error("Check join status error:", error)
    return Response.json({ hasJoined: false })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, txHash } = joinRoundSchema.parse(body)

    const db = await connectDB()
    const round = await getCurrentRound()

    if (!round) {
      return Response.json({ error: "No active round" }, { status: 404 })
    }

    // Check if user already joined this round
    const entriesCollection = db.collection("entries")
    const existingEntry = await entriesCollection.findOne({
      roundId: round.roundId,
      address: address.toLowerCase(),
    })

    if (existingEntry) {
      return Response.json({ 
        success: true, 
        message: "Already joined this round",
        roundId: round.roundId 
      })
    }

    // Save entry
    await entriesCollection.insertOne({
      roundId: round.roundId,
      address: address.toLowerCase(),
      txHash,
      createdAt: new Date(),
    })

    // Update round pool
    const roundsCollection = db.collection("rounds")
    await roundsCollection.updateOne(
      { roundId: round.roundId },
      { $inc: { pool: round.entryFee } }
    )

    return Response.json({
      success: true,
      roundId: round.roundId,
      pool: round.pool + round.entryFee,
    })
  } catch (error) {
    console.error("Join round error:", error)
    return Response.json({ error: "Failed to join round" }, { status: 500 })
  }
}

