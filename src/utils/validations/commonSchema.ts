import moment from "moment"
import { isValidWallet } from "utils/isValidtWallet"
import * as Yup from "yup"

export const name = {
  name: Yup.string().required("validation:name-required")
}

export const wallet = {
  wallet: Yup.string()
    .required("validation:wallet-required")
    .test("is-valid-address", "validation:wallet-invalid", (value) =>
      isValidWallet(value)
    )
}

export const nftaddress = {
  wallet: Yup.string()
    .required("validation:nft-address-required")
    .test("is-valid-address", "validation:nft-invalid", (value) =>
      isValidWallet(value)
    )
}

export const treasuryName = {
  name: Yup.string().required("validation:treasury-name-required")
}

export const transactionName = {
  transactionName: Yup.string().required("validation:transaction-name-required")
}

export const withdrawAmount = {
  withdrawAmount: Yup.string()
    .required("withdraw.enter-withdraw-amount")
    .test("is-not-zero", "withdraw.not-zero", (value) => {
      return typeof value === "string" && parseFloat(value) > 0
    })
}

export const email = {
  email: Yup.string()
    .email("validation:invalid-email")
    .required("validation:email-required")
}

export const telegram = {
  telegram: Yup.string().required("validation:telegram-required")
}

export const exportStartDate = {
  startDate: Yup.string()
    .required("validation:export-start-date-time-required")
    .test(
      "check-start-date",
      "validation:export-start-date-time-before-today",
      (startDate) => {
        return moment(startDate, "DD/MM/YYYY").isBefore(moment())
      }
    )
}
export const exportEndDate = {
  endDate: Yup.string()
    .required("validation:export-end-date-time-required")
    .test(
      "check-end-date-before-start-date",
      "validation:export-end-date-time-before-start-date",
      (endDate, context) => {
        return (
          !context.parent.startDate ||
          moment(endDate, "DD/MM/YYYY").isAfter(
            moment(context.parent.startDate, "DD/MM/YYYY")
          )
        )
      }
    )
    .test(
      "check-end-date-greater-than-today",
      "validation:export-end-date-time-before-today-date",
      (endDate) => {
        return moment(endDate, "DD/MM/YYYY").isBefore(moment())
      }
    )
}

export const reportFormat = {
  reportFormat: Yup.mixed().required("validation:export-choose-report-format")
}

export const remarks = {
  remarks: Yup.string().test(
    "check-remarks",
    "validation:remarks-required",
    (remarks, context) => {
      return !!remarks || !context.parent.showRemarks
    }
  )
}

export const token = {
  token: Yup.string().required("validation:token-required")
}

export const amount = {
  amount: Yup.string()
    .required("validation:amount-required")
    .test("amount-negative", "validation:amount-negative", (amount) => {
      return Number(amount) > 0
    })
}

export const startDate = {
  startDate: Yup.string()
    .required("validation:start-date-time-required")
    .test(
      "check-start-date",
      "validation:start-date-time-before-today",
      (startDate, context) => {
        return moment(
          `${startDate} ${context.parent.startTime}`,
          "DD/MM/YYYY LT"
        ).isAfter(moment())
      }
    )
}

export const endDate = {
  endDate: Yup.string()
    .required("validation:end-date-time-required")
    .test(
      "check-end-date",
      "validation:end-date-time-before-start-date-time",
      (endDate, context) => {
        return (
          !context.parent.startDate ||
          !context.parent.startTime ||
          moment(
            `${context.parent.startDate} ${context.parent.startTime}`,
            "DD/MM/YYYY LT"
          ).isBefore(
            moment(`${endDate} ${context.parent.endTime}`, "DD/MM/YYYY LT")
          )
        )
      }
    )
}

export const startTime = {
  startTime: Yup.string()
    .required("validation:start-date-time-required")
    .test(
      "check-start-time",
      "validation:start-date-time-before-today",
      (startTime, context) => {
        return (
          !context.parent.startDate ||
          moment(
            `${context.parent.startDate} ${startTime}`,
            "DD/MM/YYYY LT"
          ).isAfter(moment())
        )
      }
    )
}

export const endTime = {
  endTime: Yup.string()
    .required("validation:end-date-time-required")
    .test(
      "check-end-time",
      "validation:end-date-time-before-start-date-time",
      (endTime, context) => {
        return (
          !context.parent.startDate ||
          !context.parent.startTime ||
          moment(
            `${context.parent.startDate} ${context.parent.startTime}`,
            "DD/MM/YYYY LT"
          ).isBefore(
            moment(`${context.parent.endDate} ${endTime}`, "DD/MM/YYYY LT")
          )
        )
      }
    )
}

export const toggle = {
  toggle: Yup.boolean().default(false)
}

export const noOfTimes = {
  noOfTimes: Yup.string()
    .test(
      "noOfTimes-required",
      "validation:noOfTimes-required",
      (noOfTimes, context) => {
        return !!noOfTimes || !context.parent.enableStreamRate
      }
    )
    .test(
      "noOfTimes-invalid",
      "validation:noOfTimes-invalid",
      (noOfTimes, context) => {
        return (
          (Number(noOfTimes) > 0 && Number.isInteger(Number(noOfTimes))) ||
          !context.parent.enableStreamRate
        )
      }
    )
}

export const tokenAmount = {
  tokenAmount: Yup.string()
    .test(
      "tokenAmount-required",
      "validation:tokenAmount-required",
      (tokenAmount, context) => {
        return !!tokenAmount || !context.parent.enableStreamRate
      }
    )
    .test(
      "tokenAmount-invalid",
      "validation:tokenAmount-invalid",
      (tokenAmount, context) => {
        return Number(tokenAmount) > 0 || !context.parent.enableStreamRate
      }
    )
}

export const interval = {
  interval: Yup.string().test(
    "interval-required",
    "validation:interval-required",
    (interval, context) => {
      return !!interval || !context.parent.enableStreamRate
    }
  )
}

export const file = {
  file: Yup.string()
}
