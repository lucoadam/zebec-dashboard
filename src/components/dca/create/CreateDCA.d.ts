export interface DCA {
  depositFrom: string
  depositTokenAddress: string
  depositAmount: number
  buyTokenAddress: string
  buyAmount: number
  frequency: string
  dcaStartDate: string
  dcaStartTime: string
}

export interface StepsComponentProps {
  setCurrentStep: (step: number) => void
  setDCA: React.Dispatch<React.SetStateAction<DCA>>
  dca: DCA
}

export interface Step {
  name: string
  subHeading: string
  component: React.FC<StepsComponentProps>
}
