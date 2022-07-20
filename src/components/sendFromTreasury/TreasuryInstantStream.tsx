import { useAppSelector } from "app/hooks"
import type { NextPage } from "next"
import { useState } from "react"
import { InstantStream } from "./InstantStream"
import { InstantStreamFormData } from "./InstantStream.d"
import { InstantStreamOverview } from "./InstantStreamOverview"

const TreasuryInstantStream: NextPage = () => {
  const [formValues, setFormValues] = useState<InstantStreamFormData>()
  const treasuryBalance =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  return (
    <div className="grid lg:flex">
      <InstantStream
        setFormValues={setFormValues}
        tokenBalances={treasuryBalance}
        addFile={true}
        className="w-full lg:w-[628px]"
      />
      <InstantStreamOverview className="lg:ml-[79px]" formValues={formValues} />
    </div>
  )
}

export default TreasuryInstantStream
