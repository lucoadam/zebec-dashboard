import { FC, useEffect } from "react"
import ReactTooltip from "react-tooltip"
import { formatCurrency } from "utils"

interface FormatCurrencyProps {
  amount: number | string
  before?: ""
  fix?: number
  showTooltip?: boolean
}

export const FormatCurrency: FC<FormatCurrencyProps> = (props) => {
  const { amount, before, fix, showTooltip = true } = props

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  return (
    <>
      {showTooltip ? (
        <span data-tip={amount}>{formatCurrency(amount, before, fix)}</span>
      ) : (
        formatCurrency(amount, before, fix)
      )}
    </>
  )
}
