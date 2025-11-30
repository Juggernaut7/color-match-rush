import { connectDB } from "@/lib/db"
import { getCurrentRound } from "@/lib/utils/getCurrentRound"
import { z } from "zod"

const submitScoreSchema = z.object({
  roundId: z.string().min(1),
  address: z.string().min(1),
  score: z.number().int().min(0),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { roundId, address, score } = submitScoreSchema.parse(body)

    const db = await connectDB()
    const scoresCollection = db.collection("scores")

    // Check if user has an entry for this round
    const entriesCollection = db.collection("entries")
    const entry = await entriesCollection.findOne({
      roundId,
      address: address.toLowerCase(),
    })

    if (!entry) {
      return Response.json({ error: "Must join round first" }, { status: 400 })
    }

    // Get existing score record for this round
    const existingScore = await scoresCollection.findOne({
      roundId,
      address: address.toLowerCase(),
    })

    // Check if user has already played (ONE play per round only)
    if (existingScore) {
      return Response.json({ 
        error: "You have already played this round. Wait for the next round to play again.",
        score: existingScore.score || existingScore.totalScore || 0,
        hasPlayed: true
      }, { status: 400 })
    }

    // Insert score (first and only play for this round)
    await scoresCollection.insertOne({
      roundId,
      address: address.toLowerCase(),
      score: score, // Single score (not total)
      totalScore: score, // For compatibility
      bestScore: score,
      playCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json({
      success: true,
      score: score,
      hasPlayed: true,
      canPlayAgain: false, // Can't play again in same round
    })
  } catch (error) {
    console.error("Score submission error:", error)
    return Response.json({ error: "Failed to submit score" }, { status: 500 })
  }
}

