import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { withdrawProps } from "../data";
import { useTranslation } from "next-i18next";
import * as Icons from "assets/icons";
import Loading from "assets/images/gifs/withdrawing.gif"

const Withdrawing: FC<withdrawProps> = ({ setCurrentStep, withdrawAmount,setWithdrawAmount }) => {
    const { t } = useTranslation("transactions");
    useEffect(() => {
        setTimeout(() => {
            setCurrentStep(-1);
            
        }, 1000);
    }, [])
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16"><img {...Loading}/></div> 
            <div className="text-content-secondary text-heading-5 pt-4">{t("withdraw.withdrawing")}</div>
            <div className="text-primary-contrast text-heading-5 ">{withdrawAmount} SOL</div>
            <div className="flex justify-center pt-4">
                <div>
                    <Icons.Asterik />

                </div>
                <div className="text-warning text-caption pl-2 ">
                    {t("withdraw.dont-close-window")}
                </div>
            </div>



        </div>
    );
}
export default Withdrawing; 
