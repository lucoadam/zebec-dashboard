import * as Yup from "yup"
import { exportEndDate, reportFormat, exportStartDate } from "./commonSchema"

export const exportSchema = Yup.object().shape({
  ...exportStartDate,
  ...exportEndDate,
  ...reportFormat
})
