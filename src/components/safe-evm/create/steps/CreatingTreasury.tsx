import { useAppDispatch } from "app/hooks"
import { CreatingTreasuryGif } from "assets/images"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import { Treasury } from "../CreateTreasury.d"
import Image from "next/image"
import { createSafeEvm } from "application/safe-evm/createTreasury"
import { useSigner } from "wagmi"

interface CreatingTreasuryProps {
  treasury: Treasury
  setCurrentStep: (step: number) => void
}

const CreatingTreasury: FC<CreatingTreasuryProps> = ({
  treasury,
  setCurrentStep
}) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: signer } = useSigner()

  useEffect(() => {
    signer &&
      dispatch(
        createSafeEvm({
          data: {
            name: treasury.name,
            minValidator: treasury.minValidator,
            owners: treasury.owners.map(each => each.wallet)
          },
          signer,
          callback: () => {
            router.push("/safes")
          },
          errorCallback: () => {
            setCurrentStep(2)
          }
        })
      )

    // eslint-disable-next-line
  }, [signer])

  return (
    <>
      <h3 className="leading-7 font-semibold text-base text-content-primary">
        Creating Treasury
      </h3>
      <p className="text-content-secondary font-normal text-sm mb-8">
        Your treasury is being created. It can take up to a minute.
      </p>
      <Image
        src={CreatingTreasuryGif}
        width={100}
        height={92}
        layout="fixed"
        alt="Creating treasury"
      />
    </>
  )
}

export default CreatingTreasury
