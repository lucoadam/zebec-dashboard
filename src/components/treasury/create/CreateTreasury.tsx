import { NextPage } from "next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CheckIcon, ArrowIcon, CrossIcon } from "assets/icons";
import { Button, InputField } from "components/shared";
import { Step, StepsComponentProps, StepsContainerProps } from "./CreateTreasury.d";
import OwnerLists from "../OwnerLists";

const StepsContainer = styled.div<StepsContainerProps>`
  position: relative;
  &:after {
    position: absolute;
    left: 11px;
    height: 48px;
    width: 2px;
    top: 48px;
    margin-top: 0.5rem;
    content: ${(props: StepsContainerProps) => (props.isLast ? "none" : '""')};
    background-color: var(--outline-main);
  }
`;

const Steps: Step[] = [
  {
    name: "Name",
    subHeading: "Give your treasury name.",
    component: (props: StepsComponentProps) => (
      <>
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          Name Your Treasury
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[32px]">
          Let’s start by giving a name to your treasury.
        </p>
        <InputField
          error={!!props.errors.name?.message}
          helper={props.errors.name?.message}
          label="Treasury Name"
          placeholder="Enter Treasury Name"
          {...props.register("name", { required: {
            value: true,
            message: "Please enter a name for your treasury."
          }, minLength: {
            value: 3,
            message: "Valid length data is necessary"
          } })}
          setValue={props.setValue}
        />
        <Button
          title="Continue"
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          onClick={() => {
            if(props.errors.name || (!props.getValues('name') && props.getValues('name')==='')) {
              const inputElement = document.querySelector('input[name="name"]') as HTMLInputElement;
              inputElement.focus();
              return;
            }
            props.setCurrentStep(1);
          }}
        />
      </>
    ),
  },
  {
    name: "Owners and Confirmations",
    subHeading: "Add owners and set no. of confirmations.",
    component: (props: StepsComponentProps) => (
      <>
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          Add Owners
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[36px]">
          Multiple owners will be notified before initializing a transaction.
          Once specific no. of owners approve the transaction, the stream will
          begin. You won’t be able to add, remove or edit the owners once
          created.
        </p>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3">
            <InputField
              setValue={props.setValue}
              error={false}
              label="Owner Name"
              placeholder="Enter Name"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <InputField
              setValue={props.setValue}
              error={false}
              label="Owner Address"
              placeholder="Enter Wallet Address"
            />
          </div>
        </div>
        <Button
          size="small"
          title="Choose from address book"
          EndIcon={ArrowIcon}
        />
        <p className="text-content-secondary font-normal text-lg mt-3">
          Added Owners
        </p>

        <OwnerLists/>
        
        <Button title="Previous" onClick={() => props.setCurrentStep(0)} />
        <Button title="Submit" onClick={() => props.setCurrentStep(2)} />
      </>
    ),
  },
  {
    name: "Review & Confirm",
    subHeading: "Review your details and confirm the creation.",
    component: (props: StepsComponentProps) => (
      <>
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          Review
        </h3>
        <p className="text-content-secondary font-normal text-sm">
          Please review all the details carefully before creating the treasury
          as it cannot be changed afterwards.
        </p>
        <input type="text" className="form-checkbox rounded text-pink-500" />
        <Button title="Previous" onClick={() => props.setCurrentStep(1)} />

        <Button title="Submit" onClick={() => props.setCurrentStep(2)} />
      </>
    ),
  },
];

const CreateTreasury: NextPage = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      name: "",
    }
  });

  const getStepState = (index: number, isIcon: boolean = false) => {
    if (index === currentStep) {
      return isIcon ? index + 1 : "bg-primary";
    }
    if (index < currentStep) {
      return isIcon ? <CheckIcon /> : "bg-success";
    }
    return isIcon ? index + 1 : "bg-content-contrast";
  };

  return (
    <div className="bg-background-secondary py-[76px] px-[120px]">
      <div className="flex flex-wrap">
        <div className="flex-none sm:w-1/2 w-full">
          {Steps.map((step: Step, index: number) => (
            <StepsContainer
              isLast={Steps.length - 1 === index}
              className={`flex mb-[64px] ${currentStep === index ? "" : ""}`}
              key={`steps-${index}`}
            >
              <div
                className={`w-[26px] flex justify-center items-center text-center h-[26px] self-center mr-2 rounded-full ${getStepState(
                  index
                )} text-xs`}
              >
                {getStepState(index, true)}
              </div>
              <div className="w-4/5">
                <h4 className="leading-6 font-medium text-sm text-content-primary">
                  {step.name}
                </h4>
                <p className="text-content-secondary">{step.subHeading}</p>
              </div>
            </StepsContainer>
          ))}
        </div>
        <div className="flex-auto sm:w-1/2 w-full">
          <div className="bg-background-tertiary py-[48px] px-[32px]">
            {Steps[currentStep].component({
              setCurrentStep,
              register,
              errors,
              watch,
              setValue,
              getValues,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTreasury;
