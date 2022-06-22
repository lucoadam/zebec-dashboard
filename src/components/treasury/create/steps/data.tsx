import { Step, StepsComponentProps } from "components/treasury/create/CreateTreasury.d";
import AddOwners from "./AddOwners";
import AddTreasuryName from "./AddTreasuryName";
import ReviewTreasury from "./ReviewTreasury";

export const StepsList: Step[] = [
    {
      name: "Name",
      subHeading: "Give your treasury name.",
      component: (props: StepsComponentProps) => <AddTreasuryName {...props} />,
    },
    {
      name: "Owners and Confirmations",
      subHeading: "Add owners and set no. of confirmations.",
      component: (props: StepsComponentProps) => <AddOwners {...props} />,
    },
    {
      name: "Review & Confirm",
      subHeading: "Review your details and confirm the creation.",
      component: (props: StepsComponentProps) => <ReviewTreasury {...props} />,
    },
  ];