import * as Yup from "yup"
import { email, telegram } from "./commonSchema"

export const notificationSchema = Yup.object().shape({
  ...email,
  ...telegram
})
