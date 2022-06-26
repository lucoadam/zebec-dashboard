import React from "react";

export interface StepsContainerProps {
  isLast: boolean;
}

export interface Treasury {
  name: string;
  owners: Owner[];
  minValidator: number;
}

export interface StepsComponentProps {
  setCurrentStep: (step: number) => void;
  setTreasury: React.Dispatch<React.SetStateAction<Treasury>>;
  treasury: Treasury;
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