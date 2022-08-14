import * as Icons from "assets/icons"
import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC } from "react"

const Farms: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="farms p-6 rounded bg-background-secondary flex flex-col gap-y-6 h-[264px]">
        <div className="flex justify-between items-center">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            {t("home:farms.title")}
          </div>
          <Button
            size="small"
            title={`${t("home:button.go-to-farms")}`}
            endIcon={<Icons.ArrowRightIcon />}
          />
        </div>
      </div>
    </>
  )
}

export default Farms
