import { ContinuousStreamFormData } from "components/send/ContinuousStream"
import { UseFormResetField, UseFormSetValue } from "react-hook-form"

export interface FileState {
  name: string
  url: string
  uploading: boolean
  error: boolean
  progress: number
  size: number
  errorMessage: string
}

export interface FileUploadProps {
  resetField: UseFormResetField<ContinuousStreamFormData>
  setValue: UseFormSetValue<ContinuousStreamFormData>
  name: ContinuousStreamFormData
  isReset?: boolean
}
