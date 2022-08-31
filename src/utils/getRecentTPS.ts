import { connection } from "constants/cluster"

export const getRecentTPS = async () => {
  let currentTPS: number
  try {
    const performanceSamples = await connection.getRecentPerformanceSamples(1)
    currentTPS = Math.floor(
      performanceSamples[0].numTransactions /
        performanceSamples[0].samplePeriodSecs
    )
  } catch (error) {
    console.log(error)
    currentTPS = 0
  }
  return currentTPS
}
