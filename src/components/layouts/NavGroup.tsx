import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import { RoutesArrayProps } from "./routes";
import * as Icons from "../../assets/icons";

const NavGroup: FC<RoutesArrayProps> = (props) => {
  const { name, Icon } = props;
  const { t } = useTranslation("common");

  return (
    <>
      <div className="flex items-center gap-x-3 cursor-pointer">
        <div className="h-6 w-6 rounded-md bg-background-secondary text-content-contrast text-base grid place-content-center">
          <Icon />
        </div>
        <div className="flex items-center gap-x-1.5 text-content-secondary">
          <span className="text-subtitle-sm font-medium">{t(`${name}`)}</span>
          <Icons.CheveronDownIcon className="text-base" />
        </div>
      </div>
    </>
  );
};

export default NavGroup;
