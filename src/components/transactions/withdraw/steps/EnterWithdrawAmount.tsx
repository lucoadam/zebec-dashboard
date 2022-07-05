import React, { FC, Fragment, useRef, useState } from "react";
import { Button, IconButton, InputField, Modal } from "components/shared";
import * as Icons from "assets/icons";
import * as Images from "assets/images";
import { useTranslation } from "next-i18next";
import { withdrawProps } from "../data";


const EnterWithdrawAmount: FC<withdrawProps> = ({ setCurrentStep,withdrawAmount, setWithdrawAmount }) => {
  const { t } = useTranslation("transactions");
 
  return (
    <div className="text-content-primary" >
      <div className="text-content-primary text-subtitle">
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
      <div className="pt-[12px] pb-[12px]">
        <InputField
          label={t("")}
          className="relative text-black"
          error={false}>
          <div>
            <input
              className="w-full h-10"
              placeholder={t("withdraw.enter-amount")}
              type="number"
              min="0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}

            />
            <Button
              size="small"
              title={t("withdraw.max")}
              className="absolute right-[10px] top-[8px] text-black"
              onClick={(e) => { setWithdrawAmount(10) }}
            />
          </div>


        </InputField>
      </div>

      {/* warning text */}
      <div className="flex pb-[12px]" >
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
          className="w-full "
          variant="gradient"
          title={t("withdraw.withdraw")}
          onClick={() => {
            setCurrentStep(1);
            setWithdrawAmount(withdrawAmount)

          }}
        />
      </div>

      <div className="flex text-caption text-content-secondary items-center justify-center" >
        <div className="pr-2 "> <Icons.Info/></div>
        <div> 0.25% {t("withdraw.withdrawal-fees")}</div>
      </div>
    </div>
  );
}

export default EnterWithdrawAmount