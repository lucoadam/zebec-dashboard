import EnterWithdrawAmount from "./steps/EnterWithdrawAmount"
import ConfirmWithdraw from "./steps/ConfirmWithdraw"
import Withdrawing from "./steps/Withdrawing"

interface withdrawStep {
  component: React.FC<withdrawProps>
}
export interface withdrawProps {
  setCurrentStep: (step: number) => void
  withdrawAmount: number
  setWithdrawAmount: (withdrawAmount: number) => void
  fees: number
}

export const WithdrawStepsList: withdrawStep[] = [
  {
    component: (props: withdrawProps) => <EnterWithdrawAmount {...props} />
  },
  {
    component: (props: withdrawProps) => <ConfirmWithdraw {...props} />
  },
  {
    component: (props: withdrawProps) => <Withdrawing {...props} />
  }
]
