import { connectDB } from "@/lib/db"

export interface Round {
  roundId: string
  startTime: Date
  endTime: Date
  pool: number
  entryFee: number
}

export async function getCurrentRound(): Promise<Round | null> {
  const db = await connectDB()
  const roundsCollection = db.collection("rounds")

  // Find active round (current time between startTime and endTime)
  const now = new Date()
  const activeRound = await roundsCollection.findOne({
    startTime: { $lte: now },
    endTime: { $gte: now },
  })

  if (activeRound) {
    return {
      roundId: activeRound.roundId,
      startTime: activeRound.startTime,
      endTime: activeRound.endTime,
      pool: activeRound.pool || 0,
      entryFee: activeRound.entryFee || 0.5,
    }
  }

  // If no active round, create one
  const roundId = `round-${Date.now()}`
  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + 12 * 60 * 60 * 1000) // 12 hours

  await roundsCollection.insertOne({
    roundId,
    startTime,
    endTime,
    pool: 0,
    entryFee: 0.5,
    createdAt: new Date(),
  })

  return {
    roundId,
    startTime,
    endTime,
    pool: 0,
    entryFee: 0.5,
  }
}


