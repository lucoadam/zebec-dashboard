import * as Icons from "assets/icons"
import { Button } from "components/shared"
import { FC } from "react"

const Farms: FC = () => {
  return (
    <>
      <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-6 h-[264px]">
        <div className="flex justify-between items-center">
          <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
            FARMS
          </div>
          <Button
            size="small"
            title="Go to Farms"
            endIcon={<Icons.ArrowRightIcon />}
          />
        </div>
      </div>
    </>
  )
}

export default Farms
