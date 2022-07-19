import * as Yup from "yup"
import { treasuryName } from "./commonSchema"

export const addTreasuryNameSchema = Yup.object().shape({
  ...treasuryName
})
