import { useAppSelector } from "app/hooks"
export const FlowSteps = () => {
  const { step } = useAppSelector((state) => state.xWalletApprovalMessage)

  return <div>{step}</div>
}
