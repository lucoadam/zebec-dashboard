// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getIsTransferCompletedSolana } from "@certusone/wormhole-sdk"
import { SOL_TOKEN_BRIDGE_ADDRESS } from "zebec-wormhole-sdk-test"
import { connection } from "constants/cluster"

type Data = {
  success: boolean
  message?: string
  isTransferComplete?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { transferVaa } = req.body
    const isTransferComplete = await getIsTransferCompletedSolana(
      SOL_TOKEN_BRIDGE_ADDRESS,
      Buffer.from(transferVaa, "base64"),
      connection
    )
    res.status(200).json({ success: true, isTransferComplete })
  } else {
    res.status(400).json({ success: false, message: "Invalid request method" })
  }
}
