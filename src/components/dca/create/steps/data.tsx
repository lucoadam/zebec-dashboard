import { Step, StepsComponentProps } from "components/dca/create/CreateDCA.d"
import { CreateDCA } from "./CreateDCA"
import { InitializeDCA } from "./InitializeDCA"

export const StepsList: Step[] = [
  {
    name: "first-steper.step.name",
    subHeading: "first-steper.step.description",
    component: (props: StepsComponentProps) => <CreateDCA {...props} />
  },
  {
    name: "second-steper.step.name",
    subHeading: "second-steper.step.description",
    component: (props: StepsComponentProps) => <InitializeDCA {...props} />
  }
]
