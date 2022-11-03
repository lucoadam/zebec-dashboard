import { FC } from "react"
import { Button } from "./Button"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import api from "api/api"
import { useAppDispatch } from "app/hooks"
import { toast } from "features/toasts/toastsSlice"

interface ViewReferenceFileProps {
  file: string
}

export const ViewReferenceFile: FC<ViewReferenceFileProps> = ({ file }) => {
  const { t } = useTranslation("transactions")
  const dispatch = useAppDispatch()

  const getFile = async () => {
    try {
      const { data } = await api.get(`/uploads/${file}/`)
      window.open(data.file, "_blank", "noopener,noreferrer")
    } catch (error) {
      dispatch(
        toast.error({
          message: "Error getting reference file."
        })
      )
    }
  }

  return (
    <>
      <div className="text-content-primary">
        <Button
          title={`${t("table.view-reference-file")}`}
          size="small"
          endIcon={<Icons.OutsideLinkIcon className="text-content-contrast" />}
          onClick={getFile}
        />
      </div>
    </>
  )
}
