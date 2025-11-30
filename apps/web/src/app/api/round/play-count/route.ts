import { connectDB } from "@/lib/db"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const address = searchParams.get("address")
    const roundId = searchParams.get("roundId")

    if (!address || !roundId) {
      return Response.json({ playCount: 0, canPlay: true, totalScore: 0 })
    }

    const db = await connectDB()
    const scoresCollection = db.collection("scores")
    
    const scoreRecord = await scoresCollection.findOne({
      roundId,
      address: address.toLowerCase(),
    })

    const hasPlayed = !!scoreRecord
    const score = scoreRecord?.score || scoreRecord?.totalScore || 0

    return Response.json({
      hasPlayed,
      score,
      canPlay: !hasPlayed, // Can only play once per round
      playCount: hasPlayed ? 1 : 0,
    })
  } catch (error) {
    console.error("Play count error:", error)
    return Response.json({ playCount: 0, canPlay: true, totalScore: 0 })
  }
}

