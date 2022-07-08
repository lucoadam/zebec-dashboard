import React, { FC, useEffect } from "react";
import { Button,  InputField } from "components/shared";
import * as Icons from "assets/icons";
import { useTranslation } from "next-i18next";
import { withdrawProps } from "../data";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";



const EnterWithdrawAmount: FC<withdrawProps> = ({ setCurrentStep,withdrawAmount, setWithdrawAmount }) => {
  const { t } = useTranslation("transactions");

   const validationSchema = Yup.object().shape({
    withdrawamount: Yup.string().required(t("withdraw.enter-withdraw-amount"))
    .test("is-not-zero", t("withdraw.not-zero"), (value) =>{
    {console.log("value",typeof value)}
       return typeof value==="string" && parseFloat(value)>0
        
    }),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: any) => {
    setWithdrawAmount(data.withdrawamount)
    setCurrentStep(1);
    
  };
  useEffect(() => {
    if (withdrawAmount!=null && withdrawAmount!=0) {
      setValue("withdrawamount", withdrawAmount);
    }
  }, [withdrawAmount, setValue]);
 
  return (
    <div className="text-content-primary" >
      <div className="text-content-primary text-subtitle font-semibold">
        {t("withdraw.withdraw-modal-header")}

      </div>
      <div className="text-content-secondary text-caption pb-[16px]">
        {t("withdraw.withdraw-modal-subtitle")}

      </div>
      <div className="bg-background-tertiary text-caption rounded-md p-[16px]">
        <div className="flex text-content-secondary pb-4">
          <div className="pr-2"> <Icons.ArrowDownLeft /></div>
          {t("withdraw.amount-received")} 20000 SOL
        </div>
        <div className="flex text-content-secondary pb-[12px]">
          <div className="pr-2"> <Icons.ArrowTopRight /></div>
          {t("withdraw.withdrawable-amount")} 20000 SOL
        </div>
        <div className="flex items-start ">
          <div className="pr-2 pt-0.5 text-content-contrast"> <Icons.Info /></div>
          <div className="text-content-contrast">{t("withdraw.withdraw-info")}</div>

        </div>



      </div>
      {/* Input Field */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="pt-[12px] pb-[12px]">
        <InputField
          label={t("")}
          className="relative text-content-primary"
          helper={errors.withdrawamount?.message?? ""}
          error={!!errors.withdrawamount?.message}>
          <div>
            <input
              className={`w-full h-10 ${!!errors.withdrawamount?.message && "error"}` }
              placeholder={t("withdraw.enter-amount")}
              type="number"
              {...register("withdrawamount")}
              autoFocus
              
            />
            <Button
              size="small"
              title={t("withdraw.max")}
              className={`absolute right-2.5 top-2 text-content-primary `} 
              onClick={(e) => { setWithdrawAmount(10) }}
              type="button"
              
            />
          </div>


        </InputField>
      </div>
      

      {/* warning text */}
      <div className="flex pb-[12px] hidden" >
        <div className="pr-2 text-warning">
          <Icons.WarningTriangleIcon />
        </div>
        <div className="text-warning text-caption" >
          {t("withdraw.greater-amount")} 
        </div>
      </div>

      {/* withdraw Button */}

      <div className="pb-[12px]">
        <Button
          className={`w-full`} 
          variant="gradient"
          type="submit"
          title={t("withdraw.withdraw")}

        />
      </div>
      </form>

      <div className="flex text-caption text-content-secondary items-center justify-center" >
        <div className="pr-2 "> <Icons.Info/></div>
        <div> 0.25% {t("withdraw.withdrawal-fees")}</div>
      </div>
    </div>
  );
}

export default EnterWithdrawAmount