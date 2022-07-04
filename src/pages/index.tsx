import { useAppDispatch } from "app/hooks";
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice";
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice";
import { fetchTreasuryStreamingBalance } from "features/treasuryStreamingBalance/treasuryStreamingSlice";
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice";
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice";
import { fetchZebecStreamingBalance } from "features/zebecStreamingBalance/zebecStreamingSlice";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import Layout from "../components/layouts/Layout";

const Home: NextPage = () => {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTokens());
    setTimeout(() => {
      dispatch(
        fetchWalletBalance("DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf")
      );
      dispatch(
        fetchZebecBalance("DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf")
      );
      dispatch(
        fetchTreasuryBalance({
          name: "my treasury",
          address: "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf",
        })
      );
      dispatch(
        fetchZebecStreamingBalance(
          "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf"
        )
      );
      dispatch(
        fetchTreasuryStreamingBalance(
          "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf"
        )
      );
    }, 1000);
  }, [dispatch]);
  return (
    <Layout pageTitle="Zebec">
      <h1 className="text-5xl text-red-500 font-bold underline">
        {t("greeting")}
      </h1>
    </Layout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Home;
