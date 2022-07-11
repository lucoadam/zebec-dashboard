import {
  Step,
  StepsComponentProps
} from "components/treasury/create/CreateTreasury.d"
import AddOwners from "./AddOwners"
import AddTreasuryName from "./AddTreasuryName"
import ReviewTreasury from "./ReviewTreasury"

export const StepsList: Step[] = [
  {
    name: "first-steper.step.name",
    subHeading: "first-steper.step.description",
    component: (props: StepsComponentProps) => <AddTreasuryName {...props} />
  },
  {
    name: "second-steper.step.name",
    subHeading: "second-steper.step.description",
    component: (props: StepsComponentProps) => <AddOwners {...props} />
  },
  {
    name: "third-steper.step.name",
    subHeading: "third-steper.step.description",
    component: (props: StepsComponentProps) => <ReviewTreasury {...props} />
  }
]
