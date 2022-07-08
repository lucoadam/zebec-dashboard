import React, { FC, Fragment, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button} from "components/shared";
import { withdrawProps } from "../../data";
import { confirmWithdrawStep, confirmWithdrawStepsList } from "./data";


const ConfirmWithdraw: FC<withdrawProps> = ({setCurrentStep,withdrawAmount,setWithdrawAmount}) => {
    const { t } = useTranslation("transactions");
    return (
        <div>
            <div className="text-content-primary text-subtitle pb-4">
                {t("withdraw.sure-you-want-to-withdraw")} 101 SOL?
            </div>
        

            <div className="bg-background-tertiary text-caption rounded-md p-4 ">
            {confirmWithdrawStepsList.map((step: confirmWithdrawStep, index: number) => (
            <div
              className={`${index==confirmWithdrawStepsList.length-1? "flex gap-x-2 text-content-secondary": "withdrawsteps-container flex gap-x-2 pb-4 text-content-secondary" }`}
              key={`steps-${index}`}
            >
              {confirmWithdrawStepsList[index].image}
                    { confirmWithdrawStepsList[index].text} 20000 SOL
            </div>
          ))}
                


            </div>
            <div className="pt-[12px] pb-[12px]">
                <Button
                    className="w-full " 
                variant="gradient"
                title={t("withdraw.yes-withdraw")}
                onClick={() => {
                    setCurrentStep(2);

                }}
            />

            </div>
            <div className="pb-[12px]">
            <Button
                className="w-full "

                title={t("withdraw.cancel")}
                onClick={() => {

                    setCurrentStep(-1);
                    
                }}
            />
            </div>

           

        </div>
    );
}
export default ConfirmWithdraw;
