import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "./Button"

interface ButtonsTypeInterface {
  title: string
  onClick?: () => void
}

interface SupportCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  buttons: ButtonsTypeInterface[]
  className?: string
}

const SupportCard: FC<SupportCardProps> = ({
  title,
  description,
  buttons,
  className
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={twMerge(
        "w-full rounded bg-background-secondary px-6 py-6",
        className
      )}
    >
      <p className="leading-6 text-base font-semibold text-content-primary mb-2">
        {t(title)}
      </p>
      <p className="leading-5 text-sm font-normal text-content-contrast">
        {t(description)}
      </p>
      <div className="flex gap-x-2 mt-5">
        {buttons.map((each) => (
          <Button
            key={each.title}
            size="small"
            className=""
            title={`${t(each.title)}`}
            onClick={each.onClick}
            endIcon={
              <Icons.OutsideLinkIcon className="text-content-contrast" />
            }
          />
        ))}
      </div>
    </div>
  )
}

const ZebecHelp = ({
  className,
  page
}: {
  className?: string
  page?: "dca" | "treasury" | "send"
}) => {
  return (
    <>
      <SupportCard
        title={
          page === "dca"
            ? "common:support.zebec-dca-help"
            : page === "treasury"
            ? "common:support.treasury-help"
            : page === "send"
            ? "common:support.streaming-help"
            : "common:support.zebec-help"
        }
        description={
          page === "treasury"
            ? "common:support.treasury-help-description"
            : page === "send"
            ? "common:support.streaming-help-details"
            : "common:support.zebec-help-description"
        }
        buttons={[
          {
            title: "common:support.check-faq"
          },
          {
            title: "common:support.join-discord"
          }
        ]}
        className={className}
      />
    </>
  )
}

const BuildWithZebec = ({ className }: { className?: string }) => {
  return (
    <>
      <SupportCard
        title="commin:support.build-with-zebec"
        description="common:support.build-description"
        buttons={[
          {
            title: "common:support.check-documentation"
          }
        ]}
        className={className}
      />
    </>
  )
}

const SendFeedback = ({ className }: { className?: string }) => {
  return (
    <>
      <SupportCard
        title="common:support.send-feedback"
        description="common:support.feedback-description"
        buttons={[
          {
            title: "common:support.send-us-message"
          }
        ]}
        className={className}
      />
    </>
  )
}

export const SupportCardComponents = { ZebecHelp, BuildWithZebec, SendFeedback }
