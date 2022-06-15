import type { NextPage } from "next";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/layouts/Layout";
import { Button } from "../../components/shared";
import * as AvatarImages from "../../assets/images/avatars";
import * as Icons from "../../assets/icons";

const Treasury: NextPage = () => {
  const { t } = useTranslation();

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <div className="flex justify-between items-center px-3.5 pb-9">
            <h4 className="text-heading-4 font-semibold text-content-primary">
              {t("treasury:title")}
            </h4>
            <div className="flex gap-x-3">
              <Button
                title="Create New Treasury"
                variant="gradient"
                EndIcon={Icons.PlusIncircleIcon}
              />
              <Button title="See Archived Safe" EndIcon={Icons.TrashIcon} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-background-secondary rounded">
              <Image
                src={AvatarImages.Avatar2}
                layout="fixed"
                width={48}
                height={48}
              />
              <div className="flex flex-col gap-y-4 mt-6">
                <div className="text-subtitle text-content-primary font-semibold">
                  Zebec Safe
                </div>
                <div className="flex gap-x-3 items-center">
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.UserGroupIcon className="text-base" />
                    <div>120 Owners</div>
                  </div>
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.NotebookIcon className="text-base" />
                    <div>1AdXF3...DuV15</div>
                    <div className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                      <Icons.CopyIcon className="text-base" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-background-secondary rounded">
              <Image
                src={AvatarImages.Avatar3}
                layout="fixed"
                width={48}
                height={48}
              />
              <div className="flex flex-col gap-y-4 mt-6">
                <div className="text-subtitle text-content-primary font-semibold">
                  Ricks Safe
                </div>
                <div className="flex gap-x-3 items-center">
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.UserGroupIcon className="text-base" />
                    <div>120 Owners</div>
                  </div>
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.NotebookIcon className="text-base" />
                    <div>1AdXF3...DuV15</div>
                    <div className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                      <Icons.CopyIcon className="text-base" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-background-secondary rounded">
              <Image
                src={AvatarImages.Avatar4}
                layout="fixed"
                width={48}
                height={48}
              />
              <div className="flex flex-col gap-y-4 mt-6">
                <div className="text-subtitle text-content-primary font-semibold">
                  Web3 DAO
                </div>
                <div className="flex gap-x-3 items-center">
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.UserGroupIcon className="text-base" />
                    <div>120 Owners</div>
                  </div>
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.NotebookIcon className="text-base" />
                    <div>1AdXF3...DuV15</div>
                    <div className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                      <Icons.CopyIcon className="text-base" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "treasury"])),
    },
  };
}

export default Treasury;
