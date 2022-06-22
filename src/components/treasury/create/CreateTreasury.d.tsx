import {
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
  UseFormHandleSubmit
} from "react-hook-form";

export interface StepsContainerProps {
  isLast: boolean;
}

export interface Treasury {
  name: string;
  owners: Owner[];
}

export interface StepsComponentProps {
  setCurrentStep: (step: number) => void;
}

export interface Step {
  name: string;
  subHeading: string;
  component: React.FC<StepsComponentProps>;
}

export interface Owner {
  name: string;
  wallet: string; 
}