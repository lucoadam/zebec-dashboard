import * as React from "react"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { NotificationProps } from "./NotificationsDropdown"
// import { NotificationFormComponent } from "./NotificationFormComponent"
import {
  NotifiContext,
  NotifiSubscriptionCard
} from "@notifi-network/notifi-react-card"
import { MessageSigner } from "@notifi-network/notifi-core"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

// interface Notification {
//   email: string
//   telegram: string
// }

export const NotificationForm: React.FC<NotificationProps> = (
  {
    // setCurrentStep
  }
) => {
  const { t } = useTranslation("")
  // const [userNotification, setUserNotification] = React.useState<Notification>()

  const { connection } = useConnection()
  const { wallet, sendTransaction } = useWallet()
  const adapter = wallet?.adapter
  const publicKey = adapter?.publicKey?.toBase58() ?? null

  if (publicKey === null) {
    // publicKey is required
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const onSubmit = (data: any) => {
  //   setUserNotification(data)
  //   setCurrentStep(1)
  // }
  return (
    <>
      <div className="rounded  p-6  ">
        <div className="text-content-primary font-semibold">{`${t(
          "common:notifications.notification-header"
        )} `}</div>
        <div className="text-content-secondary text-caption pb-4 pt-1 border-b border-outline mb-8">{`${t(
          "common:notifications.notification-subtitle"
        )} `}</div>
        <div className="min-h-[168px] grid items-end">
          <NotifiContext
            dappAddress="zebec.io"
            walletBlockchain="SOLANA"
            env="Development"
            signer={adapter as MessageSigner}
            walletPublicKey={publicKey}
            connection={connection}
            sendTransaction={sendTransaction}
          >
            <NotifiSubscriptionCard
              cardId={`${process.env.NOTIFI_CARD_ID}`}
              darkMode
            />
          </NotifiContext>
        </div>

        {/* <NotificationFormComponent
          onSubmit={onSubmit}
          userNotification={userNotification}
        /> */}

        <div className="flex gap-x-1 justify-center mt-4">
          <div className="text-caption text-content-secondary">
            {t("common:notifications.powered-by")}
          </div>
          <div className="pb-4">
            <Icons.Notif className="w-16 text-content-primary dark:text-[#F5F6FB]" />
          </div>
        </div>
      </div>
    </>
  )
}
