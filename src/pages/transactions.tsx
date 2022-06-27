import type { NextPage } from "next";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "components/layouts/Layout";
import React from "react";
import { Tab } from "components/shared";
import * as Icons from "../assets/icons";

const Transactions: NextPage = () => {
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState<"incoming" | "outgoing">(
    "incoming",
  );
  return (
    <>
      <Layout pageTitle="Zebec -Transactions">
        <div className="flex justify-center border-b border-outline">
          <Tab
            type="plain"
            title="Incoming"
            isActive={activePage === "incoming"}
            startIcon={<Icons.ArrowDownLeftIcon />}
            count={3}
            onClick={() => setActivePage("incoming")}
          />
          <Tab
            type="plain"
            title="Outgoing"
            isActive={activePage === "outgoing"}
            startIcon={<Icons.ArrowUpRightIcon />}
            count={2}
            onClick={() => setActivePage("outgoing")}
          />
        </div>
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Transactions;
