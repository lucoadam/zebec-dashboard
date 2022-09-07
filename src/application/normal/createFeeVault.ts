/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZebecNativeStream } from "zebec-anchor-sdk-npmtest/packages/stream"

export const createVault = async (data: any, stream: ZebecNativeStream) => {
  await stream.createFeeVault(data)
}
