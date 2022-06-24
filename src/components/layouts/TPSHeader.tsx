import React, { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import { CollapseDropdown } from "../shared";
import * as Icons from "../../assets/icons";
//hooks
import { useClickOutside } from "../../hooks";

const TPSHeader = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const languageDropdownWrapperRef = useRef(null);

  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);

  useClickOutside(languageDropdownWrapperRef, {
    onClickOutside: () => setToggleDropdown(false),
  });

  return (
    <>
      <div className="px-6  bg-background-secondary">
        <div className="flex justify-center py-2 text-caption text-content-secondary relative">
          <div className="flex">
            {t("tps-header.network")}:&nbsp;
            <span className="text-error flex items-center">
              1,450 TPS <Icons.WarningTriangleIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="ml-2">{t("tps-header.description")}</div>

          <div className="absolute z-10 top-1/2 right-0 transform -translate-y-1/2">
            <div className="relative" ref={languageDropdownWrapperRef}>
              {/* Active Language */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setToggleDropdown(!toggleDropdown)}
              >
                <span className=" text-subtitle-sm leading-none text-content-primary uppercase">
                  {router.locale}
                </span>
                <Icons.CheveronDownIcon className="w-5 h-5 text-content-secondary" />
              </div>
              {/* Language Dropdown */}
              <CollapseDropdown show={toggleDropdown}>
                {router.locales?.map((locale) => {
                  return (
                    <Link key={locale} href={router.asPath} locale={locale}>
                      <a
                        className="text-subtitle-sm text-content-secondary py-3 pl-4 pr-6 uppercase whitespace-nowrap"
                        onClick={() => setToggleDropdown(!toggleDropdown)}
                      >
                        {locale}
                      </a>
                    </Link>
                  );
                })}
              </CollapseDropdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TPSHeader;
