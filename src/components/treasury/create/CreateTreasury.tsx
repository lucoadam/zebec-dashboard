import { NextPage } from "next";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as Icons from "assets/icons";
import { Button, InputField } from "components/shared";
import {
  Step,
  StepsComponentProps,
  StepsContainerProps,
  Owner,
} from "./CreateTreasury.d";
import OwnerLists from "./OwnerLists";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectField from "components/shared/SelectField";
import { isValidWallet } from "utils/isValidtWallet";

import LoadingSvg from "assets/images/treasury/loading.svg";

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

const AddTreasuryName: FC<StepsComponentProps> = (props) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a name for your treasury."),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: any) => {
    console.log(data);
    props.setCurrentStep(1);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          Name Your Treasury
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[32px]">
          Let’s start by giving a name to your treasury.
        </p>
        <InputField
          error={!!errors.name}
          helper={errors?.name?.message || ""}
          label="Treasury Name"
          placeholder="Enter Treasury Name"
          type="text"
        >
          <input {...register("name")} />
        </InputField>
        <Button
          title="Continue"
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />
      </form>
    </>
  );
};

const AddOwners: FC<StepsComponentProps> = (props) => {
  const [owners, setOwners] = React.useState<Owner[]>([
    {
      name: "Alish Dahal",
      wallet: "Hxtg59VfeWVo4bEAuW9qm9qmN2y2yYBtH3P9WEyTifkX",
    },
  ]);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    wallet: Yup.string()
      .required("Wallet address is required")
      .test("is-valid-address", "Invalid wallet address", (value) =>
        isValidWallet(value)
      ),
  });
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: any) => {
    setOwners([...owners, data]);
    reset();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          Add Owners
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[36px]">
          Multiple owners will be notified before initializing a transaction.
          Once specific no. of owners approve the transaction, the stream will
          begin. You won’t be able to add, remove or edit the owners once
          created.
        </p>
        <div className="flex md:flex-nowrap sm:flex-wrap mb-2 justify-center items-center">
          <div className="flex sm:w-auto sm:w-full">
            <div className="sm:w-full md:w-2/6 pe-2">
              <InputField
                error={!!errors.name}
                helper={errors?.name?.message || ""}
                label="Owner Name"
                placeholder="Enter Owner Name"
              >
                <input type="text" {...register("name")} />
              </InputField>
            </div>
            <div className=" sm:w-full md:w-4/6 pe-2">
              <InputField
                error={!!errors.wallet}
                helper={errors?.wallet?.message || ""}
                label="Owner Address"
                placeholder="Enter Wallet Address"
              >
                <input type="text" {...register("wallet")} />
              </InputField>
            </div>
          </div>
          <div className="w-full md:w-7 pe-2 pt-4">
            <button
              type="submit"
              className="w-7 h-7 grid ml-2 place-content-center border border-outline rounded-full cursor-pointer bg-primary"
            >
              <Icons.AddOwnerIcon className="text-base" />
            </button>
          </div>
        </div>
        <Button
          size="small"
          className="mt-[21px]"
          title="Choose from address book"
          EndIcon={Icons.ArrowIcon}
        />
        <p className="text-content-secondary font-normal text-sm mt-6 mb-3">
          Added Owners
        </p>

        <OwnerLists owners={owners} setOwners={setOwners} />
        <p className="text-content-secondary font-normal text-sm mt-[32px] mb-[12px]">
          Minimum confirmations required for any transactions
        </p>
        <div className="flex ">
          {/* dropdown */}
          <div className="w-full md:w-1/2 sm:w-full flex justify-start items-center">
            <SelectField className="mr-3 w-[70px]" totalItems={owners.length} />{" "}
            out of {owners.length} owners
          </div>
        </div>
        <Button
          title="Continue"
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          onClick={() => {
            if (owners.length > 0) {
              props.setCurrentStep(2);
            }
          }}
        />
        <Button
          title="Go Back"
          size="medium"
          className="w-full justify-center mt-[12px]"
          onClick={() => props.setCurrentStep(1)}
        />
      </form>
    </>
  );
};

const ReviewTreasury: FC<StepsComponentProps> = (props) => {
  const name = "Zebec Safe";
  const owners: Owner[] = [
    {
      name: "Alish Dahal",
      wallet: "Hxtg59VfeWVo4bEAuW9qm9qmN2y2yYBtH3P9WEyTifkX",
    },
  ];
  return (
    <>
      <h3 className="leading-7 font-semibold text-base text-content-primary">
        Review
      </h3>
      <p className="text-content-secondary font-normal text-sm">
        Please review all the details carefully before creating the treasury as
        it cannot be changed afterwards.
      </p>
      <p className="text-content-secondary font-normal text-sm mt-[32px]">
        Treasuy Name
      </p>
      <h4 className="leading-6 font-semibold text-base text-content-primary mt-[6px]">
        Zebec Safe
      </h4>
      <p className="text-content-secondary font-normal text-sm mt-[32px] mb-[6px]">
        Owners
      </p>
      <OwnerLists owners={owners} />
      <p className="text-content-secondary font-normal text-sm mt-[32px] mb-[12px]">
        Minimum confirmations required for any transactions
      </p>
      <div className="flex ">
        {/* dropdown */}
        <div className="w-full md:w-1/2 sm:w-full flex justify-start items-center">
          1 out of {owners.length} owners
        </div>
      </div>
      <Button
        title="Continue"
        variant="gradient"
        type="submit"
        size="medium"
        className="w-full justify-center mt-[32px]"
        onClick={() => {
          if (owners.length > 0) {
            props.setCurrentStep(3);
          }
        }}
      />
      <Button
        title="Go Back"
        size="medium"
        className="w-full justify-center mt-[12px]"
        onClick={() => props.setCurrentStep(0)}
      />
    </>
  );
};

const CreatingTreasury = () => {
  return (
    <>
      <h3 className="leading-7 font-semibold text-base text-content-primary">
        Creating Treasury
      </h3>
      <p className="text-content-secondary font-normal text-sm">
        Your treasury is being created. It can take up to a minute.
      </p>
      <LoadingSvg className="w-[92px] h-[92px] mt-[32px]"/>
    </>
  );
};

const Steps: Step[] = [
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

const CreateTreasury: NextPage = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const getStepState = (index: number, isIcon: boolean = false) => {
    if (index === currentStep) {
      return isIcon ? index + 1 : "bg-primary";
    }
    if (index < currentStep) {
      return isIcon ? <Icons.CheckIcon /> : "bg-success";
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
            {currentStep < Steps.length ? (
              Steps[currentStep].component({
                setCurrentStep,
              })
            ) : (
              <CreatingTreasury />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTreasury;
