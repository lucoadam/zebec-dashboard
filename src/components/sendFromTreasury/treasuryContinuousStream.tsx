import { useAppSelector } from "app/hooks"
import { ContinuousStream } from "components/send/continuousStream"
import { ContinuousStreamFormData } from "components/send/continuousStream.d"
import type { NextPage } from "next"
import { useState } from "react"
import { StreamOverview } from "components/send/streamOverview"

const TreasuryContinuousStream: NextPage = () => {
  const [formValues, setFormValues] = useState<ContinuousStreamFormData>()
  const zebecBalance = useAppSelector((state) => state.zebecBalance.tokens)
  return (
    <div className="grid md:grid-cols-2">
      <div className="w-full">
        <ContinuousStream
          setFormValues={setFormValues}
          tokenBalances={zebecBalance}
          addFile={true}
        />
      </div>
      <StreamOverview formValues={formValues} />
    </div>
  )
}

export default TreasuryContinuousStream
