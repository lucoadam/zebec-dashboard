import * as Yup from "yup";
import * as Icons from "assets/icons";
import * as AvatarImages from "assets/images/avatars";
import Image from "next/image";
import { toSubstring } from "utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField } from "components/shared";
import OwnerLists from "components/treasury/create/OwnerLists";
import { useEffect } from "react";
import CopyButton from "components/shared/CopyButton";
import { useTranslation } from "next-i18next";

const Setting = () => {

  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("validation:treasury-name-required")),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "Zebec Name",
    },
  });
  useEffect(() => {
    setValue("name", "Zebec Safe");
  }, [setValue]);
  return (
    <div className="flex w-full justify-start">
      <div className="w-1/3">
        <div className="w-full flex">
          <Image
            src={AvatarImages.Avatar1}
            layout="fixed"
            width={48}
            height={48}
            objectFit="contain"
            alt="avatar"
          />
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col mx-3">
              <div className="text-subtitle text-content-primary font-semibold">
                Zebec Safe
              </div>
              <div className="flex gap-x-3 items-center">
                <div className="flex gap-x-1.5 items-center text-sm font-normal text-content-primary">
                  <Icons.UserGroupIcon className="text-sm font-normal" />
                  <div>{5} {t('treasurySettings:owners')}</div>
                </div>
                <div className="flex gap-x-1.5 items-center text-sm font-normal text-content-primary">
                  <Icons.NotebookIcon className="text-sm font-normal" />
                  <div>{toSubstring("23423sdfjsdlfjs234230423", 6, true)}</div>
                  <div className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                    <CopyButton content="23423sdfjsdlfjs234230423" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center text-content-primary text-sm mb-[50px]">
          <span className="text-sm font-normal text-content-secondary">
          {t('treasurySettings:minimum-confirmation')}:
          </span>
          &nbsp;2 {t('treasurySettings:out-of')} 3 {t('treasurySettings:owners')}
        </div>
        <InputField
          error={!!errors?.name}
          helper={errors?.name?.message || ""}
          label={t('treasurySettings:safe-name')}
          placeholder={t('treasurySettings:enter-safe-name')}
          className="h-[40px] w-full"
          type="text"
        >
          <input {...register("name")} autoFocus />
        </InputField>
        <Button
          title={t('treasurySettings:save-changes')}
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />

        <div className="mt-[30px]">
          <div className="text-subtitle text-content-primary font-semibold">
          {t('treasurySettings:archive-safe')}
          </div>
          <div className="text-xs font-normal text-content-secondary mb-[16px]">
          {t('treasurySettings:archive-safe-description')}
          </div>
          <Button
            className="w-full"
            variant="danger"
            title={t('treasurySettings:archive-safe')}
            endIcon={<Icons.TrashIcon />}
          />
        </div>
      </div>
      <div className="w-[274px] ml-[215px]">
        <div className="text-subtitle pb-[26px] text-content-primary font-semibold">
        {t('treasurySettings:owners')}
        </div>
        <OwnerLists
          maxItems={5}
          owners={[
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew",
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew",
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew",
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew",
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew",
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew",
            },
          ]}
          showCopy
        />
      </div>
    </div>
  );
};

export default Setting;
