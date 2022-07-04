import React, { FC, Fragment, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, IconButton, InputField, Modal } from "components/shared";
import * as Icons from "assets/icons";
import { withdrawProps } from "../data";


const ConfirmWithdraw: FC<withdrawProps> = ({setCurrentStep}) => {
    const { t } = useTranslation("transactions");
    return (
        <div>
            <div className="text-content-primary text-subtitle pb-[16px]">
                {t("withdraw.sure-you-want-to-withdraw")} 101 SOL?
            </div>
            <div className="bg-background-tertiary text-caption rounded-md p-[16px]">
                <div className="flex text-content-secondary pb-4">
                    <div className="pr-2"> <Icons.ArrowDownLeft /></div>
                    {t("withdraw.amount-received")} 20000 SOL
                </div>
                <div className="flex text-content-secondary pb-4">
                    <div className="pr-2"> <Icons.Line /></div>
                    {t("withdraw.withdrawable-amount")} 20000 SOL
                </div>
                <div className="flex text-content-secondary ">
                    <div className="pr-2"> <Icons.Equals /></div>
                    <div>{t("withdraw.withdraw-amount")} 2000 SOL</div>

                </div>



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
                className="w-full mb-5"

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
