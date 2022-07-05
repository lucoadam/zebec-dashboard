import { useWallet } from "@solana/wallet-adapter-react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import TreasuryDetail from "components/treasury/detail/TreasuryDetail";
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice";
import type { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Icons from "../../assets/icons";
import Layout from "../../components/layouts/Layout";
import { Button, IconButton } from "../../components/shared";

const Treasury: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const walletObject = useWallet();

  const tokens = useAppSelector(state => state.tokenDetails.tokens);
  const dispatch = useAppDispatch();

  useEffect(()=>{
    if(tokens.length>0 && walletObject.publicKey){
      dispatch(
        fetchTreasuryBalance({
          name: "my treasury",
          address: "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf",
        })
      );
      // dispatch(fetchZebecStreamingBalance(walletObject.publicKey));
      // dispatch(fetchTreasuryStreamingBalance("DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf"));
    }
  }, [dispatch, tokens, walletObject])
  
  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <div className="flex justify-between items-center pb-[24px]">
          <div className="flex justify-start items-center px-[1.9rem]">
            <IconButton
              onClick={() => {
                router.push("/treasury");
              }}
              variant="plain"
              icon={
                <Icons.LeftArrowIcon className="cursor-pointer w-[18px] h-[16px] mr-[19px]" />
              }
            />

            <h4 className="text-heading-4 font-semibold text-content-primary">
              Zebec Safe
            </h4>
          </div>
            <div className="flex gap-x-3">
              <Button
                title="Send from Treasury"
                variant="gradient"
                endIcon={<Icons.ArrowUpRightIcon />}
              />
            </div>
          </div>
          <TreasuryDetail />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "treasury",
        "treasuryOverview",
        "treasurySettings",
        "validation"
      ])),
    },
  };
}

export default Treasury;
