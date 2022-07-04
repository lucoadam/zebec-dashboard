import { useState } from "react";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/layouts/Layout";
import { Button, Modal } from "components/shared";

const Home: NextPage = () => {
  const { t } = useTranslation("common");

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
