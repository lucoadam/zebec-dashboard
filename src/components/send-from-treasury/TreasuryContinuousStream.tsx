import { useAppSelector } from "app/hooks"
import { ContinuousStream } from "components/send/ContinuousStream"
import { ContinuousStreamFormData } from "components/send/ContinuousStream.d"
import type { NextPage } from "next"
import { useState } from "react"
import { StreamOverview } from "components/send/StreamOverview"

const TreasuryContinuousStream: NextPage = () => {
  const [formValues, setFormValues] = useState<ContinuousStreamFormData>()
  const treasuryBalance =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  return (
    <div className="grid lg:flex 2xl:w-screen">
      <ContinuousStream
        setFormValues={setFormValues}
        tokenBalances={treasuryBalance}
        addFile={true}
        className="w-full lg:w-[628px] 2xl:w-[40%]"
        type="treasury"
      />
      <StreamOverview className="lg:ml-[79px]" formValues={formValues} />
    </div>
  )
}

export default TreasuryContinuousStream
