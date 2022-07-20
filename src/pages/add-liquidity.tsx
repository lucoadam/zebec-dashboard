import Layout from "components/layouts/Layout"
import type { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Breadcrumb, Button } from "components/shared"
import { useTranslation } from "next-i18next"
import { AmountField } from "components/add-liquidity/AmountField"
import * as Icons from "assets/icons"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAppSelector } from "app/hooks"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

export interface AddLiquidityFormData {
  amount0: string
  amount1: string
}

const AddLiquidity: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [tokens, setTokens] = useState({
    token0: "ZBC",
    token1: "USDC"
  })
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)

  const validationSchema: Yup.SchemaOf<AddLiquidityFormData> =
    Yup.object().shape({
      amount0: Yup.string().required("Amount is required"),
      amount1: Yup.string().required("Amount is required")
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<AddLiquidityFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    const token0 = router.query.token0?.toString() || "ZBC"
    const token1 = router.query.token1?.toString() || "USDC"
    const tokenSymbols = tokenDetails.map((token) => token.symbol)
    if (
      token0 !== token1 &&
      tokenSymbols.includes(token0) &&
      tokenSymbols.includes(token1)
    ) {
      setTokens({
        token0,
        token1
      })
    }
  }, [router, tokenDetails])

  const onSubmit = (data: AddLiquidityFormData) => {
    console.log(data, tokens)
  }

  return (
    <Layout pageTitle={t("yieldFarm:add-liquidity")}>
      <div className="container pt-10 grid place-content-center">
        <Breadcrumb title={t("yieldFarm:back-to-farms")} arrowBack={true} />
        <div className="w-full md:w-[628px] h-[700px] bg-background-secondary rounded-[4px] p-10">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-heading-4 text-content-primary font-semibold">
              {t("yieldFarm:add-liquidity")}
            </div>
            <div className="text-caption text-content-tertiary font-normal pt-2">
              {t("yieldFarm:add-liquidity-description")}
            </div>
            <div className="flex flex-col items-center justify-between md:flex-row md:items-start gap-2 md:gap-0 mt-[50px]">
              <AmountField
                register={register}
                setValue={setValue}
                tokenSymbol={tokens.token0}
                tokens={tokenDetails}
                name="amount0"
                error={errors.amount0?.message?.toString()}
              />
              <Icons.PlusIncircleIcon className="md:mt-8 text-content-tertiary" />
              <AmountField
                register={register}
                setValue={setValue}
                tokenSymbol={tokens.token1}
                tokens={tokenDetails}
                name="amount1"
                error={errors.amount1?.message?.toString()}
              />
            </div>
            <div className="w-full bg-background-tertiary p-4 border border-outline rounded-md mt-[26px]">
              <div className="flex justify-between text-xs font-normal">
                <span className="text-content-tertiary">
                  {t("yieldFarm:base")}
                </span>
                <span className="text-content-secondary">{tokens.token0}</span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yieldFarm:max-amount")}
                </span>
                <span className="text-content-secondary">
                  147.738593 {tokens.token1}
                </span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yieldFarm:pool-liquidity")} ({tokens.token0})
                </span>
                <span className="text-content-secondary">
                  24,768.08 {tokens.token0}
                </span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yieldFarm:pool-liquidity")} ({tokens.token1})
                </span>
                <span className="text-content-secondary">
                  905,742.82 {tokens.token1}
                </span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yieldFarm:lp-supply")}
                </span>
                <span className="text-content-secondary">20,604.51 LP</span>
              </div>
              <Button
                className="text-content-primary mt-2 bg-background-secondary"
                endIcon={<Icons.CheveronDownIcon />}
                size="small"
                title="More Information"
              />
            </div>
            <Button
              variant="gradient"
              title={t("yieldFarm:add-liquidity").toString()}
              className="mt-[21px] w-full"
              type="submit"
            />
          </form>
          <div className="flex gap-2 mt-8 text-xs text-content-secondary items-center justify-center">
            <Icons.Info />
            {t("yieldFarm:liquidity-help")}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common",
        "yieldFarm",
        "send"
      ]))
    }
  }
}

export default AddLiquidity
