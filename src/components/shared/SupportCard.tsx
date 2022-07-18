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
}

export const SupportCard: FC<SupportCardProps> = ({
  title,
  description,
  buttons,
  ...rest
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={twMerge(
        "w-full rounded-[4px] bg-background-secondary px-6 py-6",
        rest.className ?? ""
      )}
    >
      <p className="leading-6 text-base font-semibold text-content-primary mb-[8px]">
        {t(title)}
        {/* {t(isTreasury ? "treasuryOverview:treasury-help" : "common:zebec-help")} */}
      </p>
      <p className="leading-5 text-sm font-normal text-content-contrast">
        {t(description)}
      </p>
      <div className="flex">
        {buttons.map((each) => (
          <Button
            key={each.title}
            size="small"
            className="mt-[21px] mr-[8px]"
            title={`${t(each.title)}`}
            onClick={each.onClick}
            endIcon={
              <Icons.OutsideLinkIcon className="text-content-contrast" />
            }
          />
        ))}
        {/* <Button
          size="small"
          className="mt-[21px]"
          title={`${t("treasuryOverview:join-discord")}`}
          endIcon={<Icons.OutsideLinkIcon className="text-content-contrast" />}
        /> */}
      </div>
    </div>
  )
}
