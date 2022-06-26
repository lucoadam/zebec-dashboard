import * as Yup from "yup";
import * as Icons from "assets/icons";
import * as AvatarImages from "assets/images/avatars";
import Image, { StaticImageData } from "next/image";
import { toSubstring } from "utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, InputField } from "components/shared";
import OwnerLists from "components/treasury/create/OwnerLists";
import { useEffect } from "react";
import CopyButton from "components/shared/CopyButton";

const Setting = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter a name for your treasury."),
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
        name: 'Zebec Name'
    }
  });
  useEffect(()=>{
    setValue("name", 'Zebec Safe')
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
                  <div>{5} Owners</div>
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
            Minimum Number of Confirmation:
          </span>
          &nbsp;2 out of 3 Owners
        </div>
        <InputField
          error={!!errors.name}
          helper={errors?.name?.message || ""}
          label="Safe Name"
          placeholder="Enter Safe Name"
          type="text"
        >
          <input {...register("name")} autoFocus   />
        </InputField>
        <Button
          title="Save Changes"
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />

        <div className="mt-[30px]">
          <div className="text-subtitle text-content-primary font-semibold">
            Archive Safe
          </div>
          <div className="text-xs font-normal text-content-secondary mb-[16px]">
            Archiving safe will remove it from Treasury. However, you can always
            unarchive it from your settings. Your funds will always be in the
            safe.
          </div>
          <Button className="w-full" btnClassName="bg-error" title="Archive Safe" EndIcon={Icons.TrashIcon}/>
        </div>
      </div>
      <div className="w-[274px] ml-[215px]">
      <div className="text-subtitle pb-[26px] text-content-primary font-semibold">
            Owners
          </div>
        <OwnerLists maxItems={5} owners={[
            {
                name: "Subas Shrestha",
                wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
                name: "Subas Shrestha",
                wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
                name: "Subas Shrestha",
                wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
          },
          {
            name: "Subas Shrestha",
            wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
        },
        {
          name: "Subas Shrestha",
          wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
      }
        ]} showCopy />
      </div>
    </div>
  );
};

export default Setting;
