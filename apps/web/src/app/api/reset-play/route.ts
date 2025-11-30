import { connectDB } from "@/lib/db"
import { NextRequest } from "next/server"
import { getCurrentRound } from "@/lib/utils/getCurrentRound"

export const dynamic = 'force-dynamic'

/**
 * Reset play status for demo purposes
 * Deletes the user's score entry for the current round, allowing them to play again
 * 
 * Usage: GET /api/reset-play?address=0x...
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const address = searchParams.get("address")

    if (!address) {
      return Response.json({ error: "Address is required" }, { status: 400 })
    }

    const db = await connectDB()
    const round = await getCurrentRound()

    if (!round) {
      return Response.json({ error: "No active round found" }, { status: 404 })
    }

    const scoresCollection = db.collection("scores")
    
    // Delete the score entry for this address and round
    const result = await scoresCollection.deleteOne({
      roundId: round.roundId,
      address: address.toLowerCase(),
    })

    if (result.deletedCount === 0) {
      return Response.json({ 
        message: "No score found to delete. You can already play.",
        canPlay: true 
      })
    }

    return Response.json({
      success: true,
      message: "Play status reset! You can now play again.",
      canPlay: true,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Reset play error:", error)
    return Response.json({ error: "Failed to reset play status" }, { status: 500 })
  }
}

