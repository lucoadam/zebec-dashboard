import * as Icons from "assets/icons"
import DCADetails from "components/dca/detail/DCADetails"
import Layout from "components/layouts/Layout"
import {
  Breadcrumb,
  BreadcrumbRightContent,
  Button,
  Modal
} from "components/shared"
import { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useState } from "react"

interface GeneralObject {
  [key: string]: string
}

const DCA: NextPage<{
  params: GeneralObject
}> = ({ params }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <Layout pageTitle={`${params?.slug ?? ""} | DCA`}>
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb
            title={params?.slug ?? "DCA"}
            arrowBack={true}
            className="md:flex"
          >
            <BreadcrumbRightContent>
              <Button
                onClick={() => setIsOpen(true)}
                title={`${t("dca:buttons.cancel-dca")}`}
                endIcon={<Icons.CrossIcon />}
              />
            </BreadcrumbRightContent>
          </Breadcrumb>
          <DCADetails />
          <Modal
            show={isOpen}
            toggleModal={toggleModal}
            className="rounded-2xl "
            hasCloseIcon={false}
          >
            <div className="">
              <div className="text-heading-5 text-content-primary pb-3">
                {t("dca:cancel-modal-header")}
              </div>
              <div className="text-content-secondary pb-3">
                {t("dca:cancel-content")}
              </div>
              <div className="pt-[12px] pb-[12px]">
                <Button
                  className="w-full"
                  variant="danger"
                  title={`${t("dca:yes-cancel-dca")}`}
                  startIcon={<Icons.TrashIcon />}
                  onClick={() => setIsOpen(true)}
                />
              </div>
              <div className="pb-[12px]">
                <Button
                  className="w-full"
                  title={`${t("dca:cancel")}`}
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({
  locale,
  params
}: {
  locale: string
  params: GeneralObject
}) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dca"])),
      params
    }
  }
}

export default DCA
