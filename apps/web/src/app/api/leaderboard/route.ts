import { connectDB } from "@/lib/db"
import { getCurrentRound } from "@/lib/utils/getCurrentRound"

export async function GET() {
  try {
    const db = await connectDB()
    const round = await getCurrentRound()

    if (!round) {
      return Response.json([])
    }

    const scoresCollection = db.collection("scores")

    // Get top 100 scores for current round (sorted by score DESCENDING - highest first)
    const leaderboard = await scoresCollection
      .find({
        roundId: round.roundId,
      })
      .sort({ 
        score: -1,  // Primary: score descending (highest first)
        totalScore: -1,  // Fallback: totalScore descending
        bestScore: -1,  // Fallback: bestScore descending
        createdAt: 1  // Tiebreaker: oldest entry first if same score
      })
      .limit(100)
      .toArray()

    // Extract score value and sort again client-side to ensure correct order
    const withScore = leaderboard.map((entry: any) => ({
      _id: entry._id,
      address: entry.address,
      score: entry.score || entry.totalScore || entry.bestScore || 0,
      createdAt: entry.createdAt || entry.updatedAt || new Date(0),
    }))

    // Sort by score descending, then by createdAt ascending (oldest first for ties)
    withScore.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score  // Higher score first
      }
      // If scores are equal, older entry comes first
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    // Add rank
    const withRank = withScore.map((entry, index) => ({
      _id: entry._id,
      address: entry.address,
      score: entry.score,
      rank: index + 1,
    }))

    return Response.json(withRank)
  } catch (error) {
    console.error("Leaderboard fetch error:", error)
    return Response.json([])
  }
}

