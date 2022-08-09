import * as Yup from "yup"
import { email } from "./commonSchema"

export const settingsSchema = Yup.object().shape({
  ...email
})
