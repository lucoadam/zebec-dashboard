import { useAppSelector } from "app/hooks"
import { ContinuousStream } from "components/send/continuousStream"
import { ContinuousStreamFormData } from "components/send/continuousStream.d"
import type { NextPage } from "next"
import { useState } from "react"
import { StreamOverview } from "components/send/streamOverview"

const TreasuryContinuousStream: NextPage = () => {
  const [formValues, setFormValues] = useState<ContinuousStreamFormData>()
  const treasuryBalance =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  return (
    <div className="grid lg:flex">
      <ContinuousStream
        setFormValues={setFormValues}
        tokenBalances={treasuryBalance}
        addFile={true}
        className="w-full lg:w-[628px]"
      />
      <StreamOverview className="lg:ml-[79px]" formValues={formValues} />
    </div>
  )
}

export default TreasuryContinuousStream
