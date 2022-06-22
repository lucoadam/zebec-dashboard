import { yupResolver } from "@hookform/resolvers/yup";
import { constants } from "common/constants";
import { Button, InputField } from "components/shared";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import * as Icons from "assets/icons";
import { Owner, StepsComponentProps } from "../CreateTreasury.d";
import SelectField from "components/shared/SelectField";
import OwnerLists from "../OwnerLists";
import { isValidWallet } from "utils/isValidtWallet";
import { useWallet } from "@solana/wallet-adapter-react";

const AddOwners: FC<StepsComponentProps> = (props) => {
  const useWalletObject = useWallet();

  const [owners, setOwners] = React.useState<Owner[]>(props.treasury.owners);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    wallet: Yup.string()
      .required("Wallet address is required")
      .test("is-valid-address", "Invalid wallet address", (value) =>
        isValidWallet(value)
      )
      .test("is-wallet-exists", "Wallet address already exists", (value) =>
        owners.every((owner) => owner.wallet !== value)
      ),
  });
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  React.useEffect(() => {
    if (owners.length === 0) {
      setValue("wallet", useWalletObject?.publicKey?.toString());
    }
  }, [useWalletObject, owners, setValue]);

  const onSubmit = (data: any) => {
    if (owners.length < constants.MAX_OWNERS) {
      setOwners([...owners, data]);
      props.setTreasury((treasury) => ({
        ...treasury,
        owners: [...owners, data],
      }));
    }
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
            <div className="sm:w-full md:w-2/6 pe-3 me-3">
              <InputField
                error={!!errors.name}
                helper={errors?.name?.message || ""}
                label="Owner Name"
                placeholder="Enter Name"
              >
                <input type="text" {...register("name")} />
              </InputField>
            </div>
            <div className="sm:w-full md:w-4/6 pe-3 me-3">
              <InputField
                error={!!errors.wallet}
                helper={errors?.wallet?.message || ""}
                label="Owner Address"
                placeholder="Enter Wallet Address"
              >
                <input
                  type="text"
                  {...register("wallet")}
                  disabled={owners.length === 0}
                />
              </InputField>
            </div>
          </div>
          <div className="w-full md:w-7 pt-2">
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
        <p className="text-content-primary font-normal text-sm mt-6 mb-3">
          Added Owners
        </p>

        <OwnerLists owners={owners} setOwners={setOwners} />
        <p className="text-content-primary font-normal text-sm mt-[32px] mb-[12px]">
          Minimum confirmations required for any transactions
        </p>
        <div className="flex ">
          {/* dropdown */}
          <div className="w-full sm:w-full flex justify-start items-center text-content-primary">
            <SelectField
              value={props.treasury.minValidator}
              onSelected={(value) =>
                props.setTreasury((treasury) => ({
                  ...treasury,
                  minValidator: value,
                }))
              }
              className="mr-3 w-[70px]"
              totalItems={owners.length}
            />{" "}
            Out of {owners.length} owners
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
      </form>
      <Button
        title="Go Back"
        size="medium"
        className="w-full justify-center mt-[12px]"
        onClick={() => props.setCurrentStep(1)}
      />
    </>
  );
};

export default AddOwners;
