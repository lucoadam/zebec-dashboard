import DefaultExport from "./steps/DefaultExport"
import PreparingReport from "./steps/PreparingReport"
import ReadyToExport from "./steps/ReadyToExport"

interface exportStep {
  component: React.FC<exportProps>
}
export interface exportProps {
  setCurrentStep: (step: number) => void
}

export const ExportStepsList: exportStep[] = [
  {
    component: (props: exportProps) => <DefaultExport {...props} />
  },
  {
    component: (props: exportProps) => <PreparingReport {...props} />
  },
  {
    component: (props: exportProps) => <ReadyToExport {...props} />
  }
]
