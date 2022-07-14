import { FC, useEffect, useRef, useState } from "react"
import * as Icons from "assets/icons"
import { toSubstring } from "utils"
import { FileState, FileUploadProps } from "./index.d"
import axios, { CancelTokenSource } from "axios"
import { useTranslation } from "next-i18next"
import { constants } from "constants/constants"

export const FileUpload: FC<FileUploadProps> = ({
  name,
  resetField,
  setValue
}) => {
  const { t } = useTranslation()
  // For file upload
  const [file, setFile] = useState<FileState>({
    name: "",
    url: "",
    uploading: false,
    progress: 0,
    size: 0,
    error: false,
    errorMessage: ""
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<CancelTokenSource>()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUploadProgress = (event: any) => {
      const percentage = Math.round((100 * event.loaded) / event.total)
      setFile((prev: FileState) => ({
        ...prev,
        progress: percentage
      }))
    }
    const data = e.target.files?.length ? e.target.files[0] : null
    if (data) {
      const fileFormat = data.type.split("/")[1]
      const fileSize = data.size
      console.log(fileFormat, fileSize)
      if (!constants.ALLOWED_FILES.includes(fileFormat)) {
        setFile((prev: FileState) => ({
          ...prev,
          name: data.name,
          error: true,
          size: fileSize,
          errorMessage: t("validation:file-type-error")
        }))
        return
      }

      if (fileSize > constants.MAX_FILE_SIZE) {
        setFile((prev: FileState) => ({
          ...prev,
          name: data.name,
          error: true,
          size: fileSize,
          errorMessage: t("validation:file-size-error")
        }))
        return
      }
      setFile((prev: FileState) => ({
        ...prev,
        name: data.name,
        uploading: true,
        size: fileSize
      }))
      const formData = new FormData()
      formData.append("file", data)
      formData.append("token", "OGpbsp3SMcMOcXxXrz5UAoywdyuZgrFD")
      try {
        const response = await axios.post(
          "https://store2.gofile.io/uploadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            cancelToken: source?.token,
            onUploadProgress
          }
        )
        setValue(name, response.data.data.downloadPage)
        setFile((prev: FileState) => ({
          ...prev,
          uploading: false,
          url: response.data.data.downloadPage
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (!axios.isCancel(error)) {
          setFile((prev: FileState) => ({
            ...prev,
            uploading: false,
            error: true
          }))
        }
      }
    }
  }

  const resetFile = () => {
    setFile({
      name: "",
      url: "",
      uploading: false,
      progress: 0,
      error: false,
      errorMessage: "",
      size: 0
    })
    resetField(name)
  }
  const handleCloseClick = () => {
    if (file.url) {
      // remove file from server

      resetFile()
    } else if (file.uploading) {
      // cancel file upload
      source?.cancel("Upload cancelled")
      resetFile()
    } else if (file.error) {
      // clear state
      resetFile()
    }
  }
  const openFileUploadDialog = () => {
    fileInputRef.current ? (fileInputRef.current.value = "") : null
    fileInputRef?.current?.click()
  }

  useEffect(() => {
    setSource(axios.CancelToken.source())
  }, [])
  return (
    <div>
      <div className="w-full relative flex items-center">
        {!file.name && !file.errorMessage && (
          <div
            onClick={openFileUploadDialog}
            className="hover:cursor-pointer flex items-center border border-outline px-2 py-[5px] gap-[5px] rounded-lg bg-background-secondary"
          >
            <span className="text-content-primary">{t("send:add-file")}</span>
            <Icons.FileUploadIcon />
          </div>
        )}
        {(file.uploading || file.error || file.url || file.errorMessage) && (
          <div className="w-full">
            <div className="flex justify-start items-center gap-1 text-content-primary">
              {file.url ? (
                <Icons.FileIcon className="w-3 h-3 text-content-secondary" />
              ) : (
                <Icons.SparkleIcon className="w-3 h-3 text-content-secondary" />
              )}
              <span className="text-sm text-content-primary font-medium">
                {toSubstring(file.name, 6, true)}
                <span className="text-[10px] text-content-secondary">
                  {` (${Math.floor(file.size / 1024)}KB)`}
                </span>
              </span>
              <Icons.CrossIcon
                onClick={handleCloseClick}
                className="hover:cursor-pointer w-3 h-3 text-content-secondary"
              />
            </div>
            {!file.url && (
              <>
                <div
                  className={`w-full ${
                    file.errorMessage ? "bg-error" : "bg-outline"
                  } h-[1px] mt-2`}
                >
                  <div
                    className={`${
                      file.error ? "bg-error" : "bg-primary"
                    } h-[1px]`}
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-content-secondary mt-2">
                  {`${Math.floor(
                    (file.progress * file.size) / (100 * 1024)
                  )}KB/${Math.floor(file.size / 1024)}KB`}
                </span>
              </>
            )}
            {file.errorMessage && (
              <p className="text-content-secondary text-xs ml-[12px] mt-1">
                {file.errorMessage}
              </p>
            )}
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          // disabled={file.uploading || !!file.url || !!file.error}
          name={name}
        />
      </div>
    </div>
  )
}
