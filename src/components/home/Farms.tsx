// import * as Icons from "assets/icons"
// import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC } from "react"
import ComingSoon from "assets/images/coming-soon.png"
import Image from "next/image"

const Farms: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="farms p-6 rounded bg-background-secondary flex flex-col gap-y-6 h-full">
        <div className="flex justify-between items-center">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            {t("home:farms.title")}
          </div>
          {/* <Button
            size="small"
            title={`${t("home:button.go-to-farms")}`}
            endIcon={<Icons.ArrowRightIcon />}
          /> */}
        </div>
        <div className="grid place-content-center w-full h-full">
          <Image
            src={ComingSoon.src}
            alt={"Coming Soon"}
            width={100}
            height={138}
          />
        </div>
      </div>
    </>
  )
}

export default Farms
