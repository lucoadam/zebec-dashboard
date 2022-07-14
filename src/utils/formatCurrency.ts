import BigNumber from "bignumber.js"
BigNumber.config({ DECIMAL_PLACES: 20 })

export const formatCurrency = (amount: number, before = "", fix = 2) => {
  return (
    before +
    amount
      .toFixed(fix + 1)
      .substring(0, amount.toFixed(fix + 1).length - 1)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
  )
}

export const displayExponentialNumber = (amount: number) => {
  const bn = new BigNumber(amount)
  if (bn.e && bn.c) {
    return bn.toFixed(bn.c.toString().length || 0)
  }
}
