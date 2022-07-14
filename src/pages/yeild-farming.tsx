import Layout from "components/layouts/Layout"
import type { GetStaticProps, NextPage } from "next"
import { useAppDispatch } from "app/hooks"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { toast } from "features/toasts/toastsSlice"
import { Button } from "components/shared"

const YeildFarming: NextPage = () => {
  const dispatch = useAppDispatch()
  return (
    <Layout pageTitle="Yeild Farming">
      <div className="container pt-10">
        <Button
          title="Success Toast"
          onClick={() => {
            dispatch(
              toast.success({
                message: "Success Toaster",
                autoClose: 10000
              })
            )
          }}
        />{" "}
        <Button
          title="Error Toast"
          onClick={() => {
            dispatch(
              toast.error({
                title: "Error Title",
                message: "Error Toaster",
                transactionId: "re"
              })
            )
          }}
        />{" "}
        <Button
          title="Info Toast"
          onClick={() => {
            dispatch(
              toast.info({
                title: "Info Title",
                message: "Error Toaster"
              })
            )
          }}
        />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"]))
    }
  }
}

export default YeildFarming
