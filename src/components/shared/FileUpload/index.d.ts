import { ContinuousStreamFormData } from "components/send/continuousStream"
import { UseFormResetField, UseFormSetValue } from "react-hook-form"

export interface FileState {
  name: string
  url: string
  uploading: boolean
  error: string
  progress: number
}

export interface FileUploadProps {
  resetField: UseFormResetField<ContinuousStreamFormData>
  setValue: UseFormSetValue<ContinuousStreamFormData>
  name: ContinuousStreamFormData
}
