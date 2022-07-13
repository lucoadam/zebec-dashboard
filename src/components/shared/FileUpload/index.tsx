import { FC, useRef, useState } from "react"
import * as Icons from "assets/icons"
import { toSubstring } from "utils"
import { FileState, FileUploadProps } from "./index.d"
import axios from "axios"

export const FileUpload: FC<FileUploadProps> = ({
  name,
  resetField,
  setValue
}) => {
  // For file upload
  const [file, setFile] = useState<FileState>({
    name: "",
    url: "",
    uploading: false,
    progress: 0,
    error: ""
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setFile((prev: FileState) => ({
        ...prev,
        name: data.name,
        uploading: true
      }))
      const formData = new FormData()
      formData.append("file", data)
      formData.append("token", "zkwLJ5BJhb2LVR3YMDwaBR0Rn2GpWikV")
      try {
        const response = await axios.post(
          "https://store1.gofile.io/uploadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            },
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
        setFile((prev: FileState) => ({
          ...prev,
          uploading: false,
          error: error.message
        }))
      }
    }
  }

  const resetFile = () => {
    setFile({
      name: "",
      url: "",
      uploading: false,
      progress: 0,
      error: ""
    })
    resetField(name)
  }
  const handleFileClick = () => {
    if (file.url) {
      // remove file from server

      resetFile()
    } else if (file.uploading) {
      // cancel file upload

      resetFile()
    } else if (file.error) {
      // clear state
      resetFile()
    } else {
      // open file upload dialog
      fileInputRef.current ? (fileInputRef.current.value = "") : null
      fileInputRef?.current?.click()
    }
  }
  return (
    <div>
      <div
        onClick={handleFileClick}
        className="w-max relative flex items-center"
      >
        <div className="hover:cursor-pointer flex items-center border border-outline px-2 py-[5px] gap-[5px] rounded-lg bg-background-secondary">
          <span className="text-content-primary">
            {file.uploading
              ? "Uploading file"
              : !!file.url
              ? "Remove file"
              : !!file.error
              ? "Upload Failed"
              : "Add file"}
          </span>
          {file.uploading ? (
            <div>{file.progress}</div>
          ) : !!file.url ? (
            <Icons.CrossIcon />
          ) : !!file.error ? (
            <Icons.CrossIcon />
          ) : (
            <Icons.FileUploadIcon />
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          // disabled={file.uploading || !!file.url || !!file.error}
          name={name}
        />
      </div>
      <span>{file.name ? toSubstring(file.name, 10, true) : ""}</span>
    </div>
  )
}
