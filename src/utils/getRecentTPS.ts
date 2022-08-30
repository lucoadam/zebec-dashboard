import { connection } from "constants/cluster"

export const getRecentTPS = async () => {
  const performanceSamples = await connection.getRecentPerformanceSamples(1)
  const currentTPS = Math.floor(
    performanceSamples[0].numTransactions /
      performanceSamples[0].samplePeriodSecs
  )
  return currentTPS
}
