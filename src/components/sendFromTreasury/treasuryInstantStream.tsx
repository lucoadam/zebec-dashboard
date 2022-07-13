import { useAppSelector } from "app/hooks"
import type { NextPage } from "next"
import { useState } from "react"
import { InstantStream } from "./instantStream"
import { InstantStreamFormData } from "./instantStream.d"
import { InstantStreamOverview } from "./instantStreamOverview"

const TreasuryInstantStream: NextPage = () => {
  const [formValues, setFormValues] = useState<InstantStreamFormData>()
  const treasuryBalance =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  return (
    <div className="grid md:grid-cols-2">
      <div className="w-full">
        <InstantStream
          setFormValues={setFormValues}
          tokenBalances={treasuryBalance}
          addFile={true}
        />
      </div>
      <InstantStreamOverview formValues={formValues} />
    </div>
  )
}

export default TreasuryInstantStream
