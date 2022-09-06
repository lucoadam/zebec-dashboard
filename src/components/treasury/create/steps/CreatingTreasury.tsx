import { useAppDispatch } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { CreatingTreasuryGif } from "assets/images"
import { createTreasury } from "application"
import { useRouter } from "next/router"
import { FC, useContext, useEffect } from "react"
import { Treasury } from "../CreateTreasury.d"
import Image from "next/image"

interface CreatingTreasuryProps {
  treasury: Treasury
  setCurrentStep: (step: number) => void
}

const CreatingTreasury: FC<CreatingTreasuryProps> = ({
  treasury,
  setCurrentStep
}) => {
  const zebecCtx = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    zebecCtx.treasury &&
      dispatch(
        createTreasury({
          data: treasury,
          treasury: zebecCtx.treasury,
          callback: () => {
            router.push("/treasury")
          },
          errorCallback: () => {
            setCurrentStep(2)
          }
        })
      )

    // eslint-disable-next-line
  }, [zebecCtx.treasury])

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
