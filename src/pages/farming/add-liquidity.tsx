import { yupResolver } from "@hookform/resolvers/yup"
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { AmountField } from "components/add-liquidity/AmountField"
import Layout from "components/layouts/Layout"
import { Button, IconButton, LoadingProgress } from "components/shared"
import type { GetStaticProps, NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { displayExponentialNumber, formatCurrency } from "utils"
import { addLiquiditySchema } from "utils/validations/addLiquiditySchema"

export interface AddLiquidityFormData {
  amount0: string
  amount1: string
  slippage: string
}

const AddLiquidity: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [tokens, setTokens] = useState({
    token0: "ZBC",
    token1: "USDC"
  })
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)

  const [tokensDisplay, setTokensDisplay] = useState({
    token0: {
      name: "",
      price: 0
    },
    token1: {
      name: "",
      price: 0
    }
  })

  const [showMore, setShowMore] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setFocus
  } = useForm<AddLiquidityFormData>({
    mode: "onChange",
    resolver: yupResolver(addLiquiditySchema),
    defaultValues: {
      slippage: "1"
    }
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

  useEffect(() => {
    setTokensDisplay({
      token0: {
        name: tokens.token0,
        price: 1
      },
      token1: {
        name: tokens.token1,
        price: Math.random()
      }
    })
  }, [tokens])

  const swapTokensDisplay = () => {
    const { token0, token1 } = tokensDisplay
    setTokensDisplay({
      token0: {
        name: token1.name,
        price: token0.price
      },
      token1: {
        name: token0.name,
        price: token0.price / token1.price
      }
    })
  }

  const onSubmit = () => {
    // on liquidity data added
  }

  const onComplete = () => {
    // fetch tokens rate

    setTokensDisplay({
      token0: {
        name: tokens.token0,
        price: 1
      },
      token1: {
        name: tokens.token1,
        price: Math.random()
      }
    })
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
        <div className="w-full md:w-[628px] pb-16 bg-background-secondary rounded-[4px] p-10">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="text-heading-4 text-content-primary font-semibold">
              {t("yeildFarming:add-liquidity")}
            </div>
            <div className="text-caption text-content-tertiary font-normal pt-2">
              {t("yeildFarming:add-liquidity-description")}
            </div>
            <div className="flex flex-col justify-between gap-[18px] mt-[50px]">
              <AmountField
                register={register}
                setValue={setValue}
                tokenSymbol={tokens.token0}
                tokens={tokenDetails}
                name="amount0"
                error={errors.amount0?.message?.toString()}
              />
              <div className="flex justify-between relative">
                <div className="flex justify-start items-center gap-2">
                  <Icons.PlusIncircleIcon className="text-content-tertiary" />
                  <span className="text-sm text-content-secondary">
                    {tokensDisplay.token0.price} {tokensDisplay.token0.name} ={" "}
                    <span
                      data-tip={displayExponentialNumber(
                        tokensDisplay.token1.price
                      )}
                    >
                      {formatCurrency(tokensDisplay.token1.price, "", 4)}
                    </span>{" "}
                    {tokensDisplay.token1.name}
                  </span>
                  <Icons.SwapArrowHorizontalIcon
                    className="cursor-pointer text-bg-primary w-4 h-4"
                    onClick={swapTokensDisplay}
                  />
                </div>
                {/* circular progress */}
                <LoadingProgress onComplete={onComplete} />
              </div>

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
              {showMore && (
                <>
                  <div className="flex justify-between text-xs font-normal mt-2">
                    <div className="flex items-center gap-[2px]">
                      <span className="text-content-tertiary">
                        {t("yeildFarming:addresses")}
                      </span>
                      <Icons.InformationIcon className="cursor-pointer w-4 h-4 text-content-primary" />
                    </div>

                    <span className="text-content-secondary">-</span>
                  </div>
                  <div className="relative flex justify-between text-xs font-normal mt-2">
                    <span className="text-content-tertiary">
                      {t("yeildFarming:slippage-tolerance")}
                    </span>
                    <input
                      className={`${
                        !!errors.slippage && "error"
                      } h-6 max-w-[52px] text-sm rounded-2 !pl-3 !pr-5`}
                      type="number"
                      step="any"
                      {...register("slippage")}
                    />
                    <span className="absolute text-sm text-content-tertiary right-2 top-1">
                      %
                    </span>
                  </div>
                </>
              )}
              <Button
                className="text-content-primary mt-2 bg-background-secondary"
                endIcon={
                  !showMore ? (
                    <Icons.CheveronDownIcon />
                  ) : (
                    <Icons.ChevronUpIcon />
                  )
                }
                size="small"
                type="button"
                onClick={() => {
                  if (!errors.slippage) {
                    setShowMore(!showMore)
                  } else {
                    setFocus("slippage")
                  }
                }}
                title={
                  !showMore
                    ? t("yeildFarming:more-information").toString()
                    : t("yeildFarming:less-information").toString()
                }
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
