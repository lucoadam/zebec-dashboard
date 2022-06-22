import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField } from "components/shared";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { StepsComponentProps } from "../CreateTreasury.d";

const AddTreasuryName: FC<StepsComponentProps> = (props) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a name for your treasury."),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (props.treasury.name !== "") {
      setValue("name", props.treasury.name);
    }
  }, [props.treasury.name, setValue]);

  const onSubmit = (data: any) => {
    props.setCurrentStep(1);
    props.setTreasury((treasury) => ({ ...treasury, name: data.name }));
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

export default AddTreasuryName;
