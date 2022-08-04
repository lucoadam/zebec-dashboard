import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch } from "app/hooks"
import LoadingSvg from "assets/images/treasury/loading.svg"
import { saveTreasury } from "features/treasury/treasurySlice"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import { Treasury } from "../CreateTreasury.d"

interface CreatingTreasuryProps {
  treasury: Treasury
}

const CreatingTreasury: FC<CreatingTreasuryProps> = ({ treasury }) => {
  const dispatch = useAppDispatch()
  const wallet = useWallet()
  const router = useRouter()
  useEffect(() => {
    dispatch(
      saveTreasury({
        data: {
          ...treasury,
          safe_name: treasury.name,
          wallet: wallet.publicKey?.toString(),
          multisig_vault: "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf"
        },
        callback: () => {
          router.push("/treasury")
        }
      })
    )
  }, [treasury, wallet, dispatch])

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
