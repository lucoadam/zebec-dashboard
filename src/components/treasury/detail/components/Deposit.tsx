import { useTranslation } from "next-i18next";

export const Deposit = () => {
  const { t } = useTranslation();
  return (
    <p className="leading-4 text-xs font-normal text-content-contrast">
      {t("treasuryOverview:deposit-description")}
    </p>
  );
};
