import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "./Button"

interface ButtonsTypeInterface {
  title: string
  icon?: React.ReactElement
  link?: string
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
        {buttons.map((each) =>
          each.link ? (
            <a
              key={each.title}
              href={each.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="small"
                className=""
                title={`${t(each.title)}`}
                onClick={each.onClick}
                startIcon={each.icon}
                endIcon={
                  <Icons.OutsideLinkIcon className="text-content-contrast" />
                }
              />
            </a>
          ) : (
            <Button
              key={each.title}
              size="small"
              className=""
              title={`${t(each.title)}`}
              onClick={each.onClick}
              startIcon={each.icon}
              endIcon={
                <Icons.OutsideLinkIcon className="text-content-contrast" />
              }
            />
          )
        )}
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
            title: "common:support.check-faq",
            link: "https://discord.com/channels/881716805234745375/901084357761069086"
          },
          {
            title: "common:support.join-discord",
            link: "https://discord.com/invite/fJM9cHuvvB"
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
        title="common:support.build-with-zebec"
        description="common:support.build-description"
        buttons={[
          {
            title: "common:support.check-documentation",
            link: "https://docs.zebec.io"
          },
          {
            title: "common:support.github",
            icon: (
              <Icons.GithubLogo className="w-3 h-3 text-content-secondary mr-1" />
            ),
            link: "https://github.com/Zebec-protocol/zebec-anchor-sdk"
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
            title: "common:support.send-us-message",
            link: "https://discord.com/channels/881716805234745375/947919288239525949"
          },
          {
            title: "common:support.telegram",
            icon: (
              <Icons.TelegramLogo className="w-3 h-3 text-content-secondary" />
            ),
            link: "https://t.me/zebecprotocol"
          }
        ]}
        className={className}
      />
    </>
  )
}

export const SupportCardComponents = { ZebecHelp, BuildWithZebec, SendFeedback }
