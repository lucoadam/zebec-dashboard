import { useTranslation } from "next-i18next"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, CollapseDropdown, InputField } from "components/shared"
import { useClickOutside } from "hooks"
import * as Icons from "assets/icons"
import { settingsSchema } from "utils/validations/settingsSchema"

interface explorer {
  name: string
  key: number
  icon: React.FC
}

export const Explorers: explorer[] = [
  {
    name: "SolScan",
    key: 0,
    icon: () => <Icons.Solscan />
  },
  {
    name: "Solana Explorer",
    key: 1,
    icon: () => <Icons.SolanaExplorer />
  }
]

export function SettingsComponent() {
  const { t } = useTranslation("common")

  const [currentExplorer, setCurrentExplorer] = useState<explorer>(Explorers[0])

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
  const onSubmit = (data: any) => {
    //setUserSetting(data)
    data
  }
  return (
    <div className="container w-full">
      <div className="flex justify-between items-center pb-4">
        <h4 className="text-heading-4 font-semibold text-content-primary pl-10 pt-10">
          {`${t("settings.settings")} `}
        </h4>
      </div>

      <div className="rounded bg-background-secondary p-10 mt-12 max-w-96">
        <div className="text-subtitle text-content-primary font-semibold">{`${t(
          "settings.email"
        )} `}</div>
        <div className="text-caption text-content-secondary pt-2">
          {`${t("settings.email-subtitle")} `}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
        <div
          className={` cursor-pointer w-[400px] relative text-content-primary `}
          onClick={() => setToggleSettingsDropdown(!toggleSettingsDropdown)}
        >
          <div className="absolute flex gap-x-4 pt-3 pl-3 pr-3">
            <div>{currentExplorer.icon({})}</div>
            <span className="text-caption text-content-primary">
              {currentExplorer.name}
            </span>
          </div>

          <input
            type="text"
            className={` cursor-pointer h-[40px] w-[390px] pl-6`}
            readOnly
          />

          <Icons.CheveronDownIcon className="absolute w-6 h-6 top-2 right-4" />
        </div>
        <div className="relative" ref={SettingsDropdownWrapperRef}>
          <CollapseDropdown
            show={toggleSettingsDropdown}
            className="w-[390px] left-1 top-4"
          >
            {Explorers.map((explorer: explorer) => (
              <div
                className="flex gap-x-4 h-12 w-full items-center bg-background- hover:bg-background-tertiary"
                key={explorer.key}
                onClick={() => {
                  setCurrentExplorer(explorer)
                }}
              >
                <div className="pl-4 ">{explorer.icon({})}</div>
                <div className="text-caption text-content-primary">
                  {explorer.name}
                </div>
              </div>
            ))}
          </CollapseDropdown>
        </div>
      </div>
    </div>
  )
}
