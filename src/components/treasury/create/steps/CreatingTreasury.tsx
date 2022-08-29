import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch } from "app/hooks"
import ZebecContext from "app/zebecContext"
import LoadingSvg from "assets/images/treasury/loading.svg"
import { createTreasury } from "application"
import { useRouter } from "next/router"
import { FC, useContext, useEffect } from "react"
import { Treasury } from "../CreateTreasury.d"

interface CreatingTreasuryProps {
  treasury: Treasury
}

const CreatingTreasury: FC<CreatingTreasuryProps> = ({ treasury }) => {
  const zebecCtx = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const wallet = useWallet()
  const router = useRouter()

  useEffect(() => {
    zebecCtx.treasury &&
      dispatch(
        createTreasury({
          data: treasury,
          treasury: zebecCtx.treasury,
          callback: () => {
            router.push("/treasury")
          }
        })
      )
  }, [treasury, wallet, dispatch, router, zebecCtx.treasury])

  return (
    <>
      <h3 className="leading-7 font-semibold text-base text-content-primary">
        Creating Treasury
      </h3>
      <p className="text-content-secondary font-normal text-sm">
        Your treasury is being created. It can take up to a minute.
      </p>
      <LoadingSvg className="w-[92px] h-[92px] mt-[32px]" />
    </>
  )
}

export default CreatingTreasury
