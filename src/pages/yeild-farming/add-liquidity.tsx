import Layout from "components/layouts/Layout"
import type { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Button, IconButton } from "components/shared"
import { useTranslation } from "next-i18next"
import { AmountField } from "components/add-liquidity/AmountField"
import * as Icons from "assets/icons"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAppSelector } from "app/hooks"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { addLiquiditySchema } from "utils/validations/addLiquiditySchema"

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<AddLiquidityFormData>({
    mode: "onChange",
    resolver: yupResolver(addLiquiditySchema)
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
    <Layout pageTitle={t("yeildFarming:add-liquidity")}>
      <div className="relative container pt-16 grid place-content-center">
        <div className="lg:absolute top-16 items-center justify-between pl-8 pr-6 mb-5">
          <div className="flex items-center py-1 gap-x-4 text-content-primary">
            <IconButton
              className="w-[18px] h-4"
              variant="plain"
              icon={<Icons.LeftArrowIcon />}
              onClick={() => router.back()}
            />
            <div className="text-sm font-semibold">
              {t("yeildFarming:back-to-farms")}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[628px] h-[700px] bg-background-secondary rounded-[4px] p-10">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-heading-4 text-content-primary font-semibold">
              {t("yeildFarming:add-liquidity")}
            </div>
            <div className="text-caption text-content-tertiary font-normal pt-2">
              {t("yeildFarming:add-liquidity-description")}
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
                  {t("yeildFarming:base")}
                </span>
                <span className="text-content-secondary">{tokens.token0}</span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yeildFarming:max-amount")}
                </span>
                <span className="text-content-secondary">
                  147.738593 {tokens.token1}
                </span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yeildFarming:pool-liquidity")} ({tokens.token0})
                </span>
                <span className="text-content-secondary">
                  24,768.08 {tokens.token0}
                </span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yeildFarming:pool-liquidity")} ({tokens.token1})
                </span>
                <span className="text-content-secondary">
                  905,742.82 {tokens.token1}
                </span>
              </div>
              <div className="flex justify-between text-xs font-normal mt-2">
                <span className="text-content-tertiary">
                  {t("yeildFarming:lp-supply")}
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
              title={t("yeildFarming:add-liquidity").toString()}
              className="mt-[21px] w-full"
              type="submit"
            />
          </form>
          <div className="flex gap-2 mt-8 text-xs text-content-secondary items-center justify-center">
            <Icons.Info />
            {t("yeildFarming:liquidity-help")}
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
        "validation",
        "yeildFarming",
        "transactions",
        "send"
      ]))
    }
  }
}

export default AddLiquidity
