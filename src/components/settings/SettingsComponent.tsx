import { useTranslation } from "next-i18next"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Breadcrumb,
  Button,
  CollapseDropdown,
  InputField
} from "components/shared"
import { useClickOutside } from "hooks"
import * as Icons from "assets/icons"
import { settingsSchema } from "utils/validations/settingsSchema"
import { saveExplorerSettings } from "features/settings/settingsSlice"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { explorers, getExplorer } from "constants/explorers"

const getExplorerIcon = (name: string) => {
  switch (name) {
    case "SolScan":
      return <Icons.Solscan />
    case "Solana Explorer":
      return <Icons.SolanaExplorer />
    case "Solana FM":
      return <Icons.SolanaFM />
    default:
      return <Icons.Solscan />
  }
}

export function SettingsComponent() {
  const { t } = useTranslation("common")
  const dispatch = useAppDispatch()
  const { explorer } = useAppSelector((state) => state.settings)

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(settingsSchema)
  })

  const [toggleSettingsDropdown, setToggleSettingsDropdown] =
    useState<boolean>(false)

  const handleSettingClose = () => {
    setToggleSettingsDropdown(false)
  }
  const SettingsDropdownWrapperRef = useRef(null)

  //handle clicking outside
  useClickOutside(SettingsDropdownWrapperRef, {
    onClickOutside: handleSettingClose
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmailSubmit = (data: any) => {
    console.log(data)
    //dispatch(saveEmailSettings(data))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onExplorerSubmit = (data: any) => {
    dispatch(saveExplorerSettings(data))
  }

  return (
    <div className="container w-full">
      <Breadcrumb title={`${t("settings.settings")} `} className="pt-20" />

      <div className="rounded bg-background-secondary p-10 mt-12 max-w-96">
        <div className="text-subtitle text-content-primary font-semibold">{`${t(
          "settings.email"
        )} `}</div>
        <div className="text-caption text-content-secondary pt-2">
          {`${t("settings.email-subtitle")} `}
        </div>
        <form onSubmit={handleSubmit(onEmailSubmit)} autoComplete="off">
          <div className="w-96">
            <div className="pt-6 pb-6">
              <InputField
                label={t("settings.email")}
                className="relative text-content-secondary"
                error={!!errors.email}
                helper={errors.email?.message?.toString() || ""}
              >
                <div>
                  <input
                    className={`w-full h-10 ${
                      !!errors.email?.message && "error"
                    }`}
                    placeholder={t("settings.email")}
                    type="text"
                    {...register("email")}
                  />
                </div>
              </InputField>
            </div>

            {/* submit Button */}

            <div className="pb-10">
              <Button
                className={`w-full `}
                variant="gradient"
                type="submit"
                title={`${t("common:settings.save-changes")}`}
              />
            </div>
          </div>
        </form>

        <div className="text-subtitle text-content-secondary font-semibold">
          {`${t("settings.default-explorer")} `}
        </div>

        <div className="text-caption text-content-secondary pt-2">
          {`${t("settings.default-explorer-details")} `}
        </div>
        <div className="text-caption text-content-secondary pt-4 pl-2 pb-2">
          {`${t("settings.explorer")} `}
        </div>
        {/* <form onSubmit={handleSubmit(onExplorerSubmit)} autoComplete="off"> */}
        <div
          className={` cursor-pointer w-[400px] relative text-content-primary `}
          onClick={() => setToggleSettingsDropdown(!toggleSettingsDropdown)}
        >
          <div className="absolute flex gap-x-4 pt-3 pl-3 pr-3">
            <div>{getExplorerIcon(explorer)}</div>
            <span className="text-caption text-content-primary">
              {getExplorer(explorer).name}
            </span>
          </div>

          <input
            type="text"
            className={` cursor-pointer h-[40px] w-[390px] pl-6`}
            readOnly
          />

          <Icons.CheveronDownIcon className="absolute w-6 h-6 top-2 right-4" />
        </div>
        <div className="relative mb-[200px]" ref={SettingsDropdownWrapperRef}>
          <CollapseDropdown
            show={toggleSettingsDropdown}
            className="w-[390px] left-1 top-4"
          >
            {explorers.map((item) => (
              <div
                className="flex gap-x-4 h-12 w-full items-center bg-background- hover:bg-background-tertiary"
                key={item.name}
                onClick={() => {
                  onExplorerSubmit({ explorer: item.name })
                  setToggleSettingsDropdown(!toggleSettingsDropdown)
                }}
              >
                <div className="pl-4 ">{getExplorerIcon(item.name)}</div>
                <div className="text-caption text-content-primary">
                  {item.name}
                </div>
              </div>
            ))}
          </CollapseDropdown>
          {/* <div className="pb-10 pt-6">
              <Button
                className={`w-[390px] `}
                variant="gradient"
                type="submit"
                title={`${t("common:settings.save-changes")}`}
              />
            </div> */}
        </div>
        {/* </form> */}
      </div>
    </div>
  )
}
