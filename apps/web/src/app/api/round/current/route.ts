import { getCurrentRound } from "@/lib/utils/getCurrentRound"

export async function GET() {
  try {
    const round = await getCurrentRound()
    
    if (!round) {
      return Response.json({ error: "No active round" }, { status: 404 })
    }

    const now = new Date()
    const timeLeft = Math.max(0, round.endTime.getTime() - now.getTime())

    return Response.json({
      roundId: round.roundId,
      startTime: round.startTime.toISOString(),
      endTime: round.endTime.toISOString(),
      pool: round.pool,
      entryFee: round.entryFee,
      timeLeft: Math.floor(timeLeft / 1000), // seconds
    })
  } catch (error) {
    console.error("Get current round error:", error)
    return Response.json({ error: "Failed to get current round" }, { status: 500 })
  }
}


