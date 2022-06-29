import type { NextPage } from "next";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "components/layouts/Layout";
import Incoming from "components/transactions/Incoming";
import Outgoing from "components/transactions/Outgoing";
import { Tab } from "components/shared";
import * as Icons from "../assets/icons";

const transactionTabs = [
  {
    title: "Incoming",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Incoming />,
  },
  {
    title: "Outgoing",
    icon: <Icons.ArrowUpRightIcon />,
    count: 2,
    Component: <Outgoing />,
  },
];

const Transactions: NextPage = () => {
  const { t } = useTranslation("transactions");

  const [activePage, setActivePage] = useState<number>(0);

  return (
    <>
      <Layout pageTitle="Zebec -Transactions">
        <div className="flex justify-center border-b border-outline">
          {/* Tabs */}
          {transactionTabs.map((transactionTab, index) => {
            return (
              <Tab
                key={transactionTab.title}
                type="plain"
                title={`${t(transactionTab.title.toLowerCase())}`}
                isActive={activePage === index}
                startIcon={transactionTab.icon}
                count={transactionTab.count}
                onClick={() => setActivePage(index)}
              />
            );
          })}
        </div>
        <div className="container py-10">
          {/* Active Tab */}
          {transactionTabs[activePage].Component}
        </div>
      </Layout>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "transactions"])),
    },
  };
}

export default Transactions;
