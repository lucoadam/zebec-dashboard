import { Button, CollapseDropdown, InputField } from "components/shared";
import { useClickOutside } from "hooks";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { depositedAssets, TokenDetails } from "./Overview";
import * as Icons from "assets/icons";

export const Withdrawal = () => {
  const { t } = useTranslation();
  const tokensDropdownWrapper = useRef(null);

  const [toggleTokensDropdown, setToggleTokensDropdown] =
    useState<boolean>(false);

  const [currentToken, setCurrentToken] = useState<TokenDetails>(
    depositedAssets[0]
  );

  const handleClose = () => {
    setToggleTokensDropdown(false);
  };

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleClose,
  });
  return (
    <>
      <p className="leading-4 text-xs font-normal text-content-contrast mb-[24px]">
        {t("treasuryOverview:withdraw-description")}
      </p>
      <InputField
        label={t("treasuryOverview:token")}
        className="mb-[24px] relative text-content-primary"
        error={false}
      >
        <div>
          <div
            onClick={() => setToggleTokensDropdown((prev) => !prev)}
            className="absolute left-2.5 top-[8px]"
          >
            <div className="relative flex cursor-pointer  w-[80px] justify-center items-center h-[40px] text-content-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-[18px] h-[18px]"
                src={currentToken.logoURI}
                alt={currentToken.symbol}
              />
              <div className="max-w-[60px] ml-[5px] overflow-x-hidden text-content-primary">
                {currentToken.symbol}
              </div>
              <Icons.CheveronDownIcon className="text-sm w-[28px]" />
            </div>
            <CollapseDropdown
              ref={tokensDropdownWrapper}
              className="w-max left-[0px]"
              show={toggleTokensDropdown}
            >
              {depositedAssets.map((item) => (
                <div
                  key={item.symbol}
                  onClick={(event) => {
                    event.stopPropagation();
                    setToggleTokensDropdown(false);
                    setCurrentToken(item);
                  }}
                  className="px-2.5 flex cursor-pointer overflow-hidden justify-start items-center h-[40px] text-content-primary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-[18px] h-[18px] mr-3"
                    src={item.logoURI}
                    alt={item.symbol}
                  />
                  <div className="text-content-primary">{item.symbol}</div>
                </div>
              ))}
            </CollapseDropdown>
          </div>

          <input
            className="w-full h-[56px] pl-[120px] is-amount"
            placeholder={t("treasuryOverview:enter-amount")}
            type="number"
            min="0"
          />
          <Button
            size="small"
            title={t("treasuryOverview:max")}
            className="h-[40px] absolute right-[10px] top-[8px] text-content-primary"
          />
        </div>
      </InputField>
      <Button
        className="w-full"
        variant="gradient"
        title={t("treasuryOverview:withdraw")}
      />
    </>
  );
};
