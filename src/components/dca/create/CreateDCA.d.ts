export interface DCA {
  depositFrom: string
  depositTokenAddress: string
  depositAmount: number
  buyTokenAddress: string
  buyAmount: number
  frequency: string
  dcaStartDate: string
  dcaStartTime: string
  symbol?: string
}
export interface GeneralObject {
  [key: string]: string | number
}

export interface StepsComponentProps {
  setCurrentStep: (step: number) => void
  setDCA: (args0: GeneralObject) => void
  dca: DCA
}

export interface Step {
  name: string
  subHeading: string
  component: React.FC<StepsComponentProps>
}
