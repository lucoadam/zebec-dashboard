import { Button } from "components/shared";
import { useTranslation } from "next-i18next";
import React, { FC } from "react";
import { Owner, StepsComponentProps } from "../CreateTreasury.d";
import OwnerLists from "../OwnerLists";

const ReviewTreasury: FC<StepsComponentProps> = (props) => {
  const {t} = useTranslation();
  return (
    <>
      <h3 className="leading-7 font-semibold text-base text-content-primary">
      {t("createTreasury:third-steper.title")}
      </h3>
      <p className="text-content-secondary font-normal text-sm">
      {t("createTreasury:third-steper.description")}
      </p>
      <p className="font-semibold text-content-primary text-sm mt-[32px]">
        {t("treasury:treasury-name")}
      </p>
      <h4 className="leading-6 font-normal text-base text-content-primary mt-[6px]">
        {props.treasury.name}
      </h4>
      <p className="text-content-primary font-semibold text-sm mt-[32px] mb-[6px]">
        {t("createTreasury:owners")}
      </p>
      <OwnerLists owners={props.treasury.owners} />
      <p className="text-content-primary font-normal text-sm mt-[32px] mb-[12px]">
        Minimum confirmations required for any transactions
      </p>
      <div className="flex ">
        {/* dropdown */}
        <div className="w-full md:w-1/2 sm:w-full flex justify-start items-center text-content-primary">
          1 out of {props.treasury.owners.length} owners
        </div>
      </div>
      <Button
        title="Continue"
        variant="gradient"
        type="submit"
        size="medium"
        className="w-full justify-center mt-[32px]"
        onClick={() => {
          if (props.treasury.owners.length > 0) {
            props.setCurrentStep(3);
          }
        }}
      />
      <Button
        title="Go Back"
        size="medium"
        className="w-full justify-center mt-[12px]"
        onClick={() => props.setCurrentStep(1)}
      />
    </>
  );
};

export default ReviewTreasury;
