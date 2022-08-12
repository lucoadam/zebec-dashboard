import BigNumber from "bignumber.js"
BigNumber.config({ DECIMAL_PLACES: 20 })

export const formatCurrency = (
  amount: number | string,
  before = "",
  fix = 2
) => {
  return (
    before +
    Number(amount)
      .toFixed(fix + 1)
      .substring(0, Number(amount).toFixed(fix + 1).length - 1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
  )
}

export const displayExponentialNumber = (amount: number | string) => {
  return new BigNumber(amount).toFixed()
}

export const splitNumber = (amount: number | string) => {
  const splittedBalance = new BigNumber(amount).toFixed().split(".")
  return [
    splittedBalance[0],
    splittedBalance[1] ? (splittedBalance[1] + "00").substring(0, 2) : "00"
  ]
}
