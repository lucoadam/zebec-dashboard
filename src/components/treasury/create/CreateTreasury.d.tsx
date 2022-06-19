import {
  FieldValues,
  UseFormGetValues,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export interface StepsContainerProps {
  isLast: boolean;
}
export interface StepsComponentProps {
  setCurrentStep: (step: number) => void;
  register: (reference: any, options: any) => UseFormRegisterReturn;
  errors: any;
  watch: (name: string) => UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<{
    name: string;
  }>;
  getValues: UseFormGetValues<{
    name: string;
  }>;
}
export interface Step {
  name: string;
  subHeading: string;
  component: React.FC<StepsComponentProps>;
}
