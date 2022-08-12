import { ZebecNativeStreamProps } from "./stream"

export const createVault = async (
  data: any,
  stream: ZebecNativeStreamProps
) => {
  const sig = await stream.createFeeVault(data)
  console.log(sig)
}
