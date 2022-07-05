import { useAppDispatch } from "app/hooks";
import { Button, Modal } from "components/shared";
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice";
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice";
import { fetchTreasuryStreamingBalance } from "features/treasuryStreamingBalance/treasuryStreamingSlice";
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice";
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice";
import { fetchZebecStreamingBalance } from "features/zebecStreamingBalance/zebecStreamingSlice";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
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

  let [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <Layout pageTitle="Zebec">
      <h1 className="text-5xl text-red-500 font-bold underline">
        {t("greeting")}
      </h1>
      <Button title="Open Modal" onClick={() => setIsOpen(true)} />
      <Modal
        show={isOpen}
        toggleModal={toggleModal}
        className="rounded"
        hasCloseIcon={true}
      >
        <div className="text-content-primary">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit magnam
          quos natus nihil ea sapiente asperiores repellat quibusdam voluptatum
          inventore, nisi dolores, sint repellendus eius nobis a officiis
          aperiam doloribus?
        </div>
      </Modal>
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
