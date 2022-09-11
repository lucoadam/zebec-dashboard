import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import { Button, CollapseDropdown } from "components/shared"
import { useClickOutside } from "hooks"
import moment from "moment"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import { toSubstring } from "utils"
import { showSignModal } from "features/modals/signModalSlice"
import { showRejectModal } from "features/modals/rejectModalSlice"

export const PendingConfirmation = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const confirmationDialogRef = useRef(null)
  const [toggleConfirmationDialog, setToggleConfirmationDialog] =
    useState<boolean>(false)
  const [showAllRemaining, setShowAllRemaining] = useState<boolean>(false)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [showAllRemaining])

  useClickOutside(confirmationDialogRef, {
    onClickOutside: () => setToggleConfirmationDialog(false)
  })

  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-2.5">
      <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
        {t("treasuryOverview:pending-confirmation")}
      </div>
      <div className="flex flex-col">
        <div className="pt-2 pb-4 flex flex-col gap-y-2 border-b border-outline">
          <div className="flex w-full items-center">
            <div className="w-1/2 flex gap-x-2.5 items-center">
              <Icons.OutgoingIcon className="flex-shrink-0 w-7 h-7" />
              <div className="flex flex-col">
                <div className="">
                  <span className=" text-content-primary font-semibold text-subtitle">
                    +120.12
                  </span>
                  <span className="text-content-contrast font-medium text-subtitle-sm ml-1">
                    SOL
                  </span>
                </div>
                <div className="text-caption text-content-contrast">
                  {t("treasuryOverview:withdraw-from-treasury")}
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-y-1 pl-3 pr-2 text-caption text-content-secondary">
              {t("treasuryOverview:initiated-by")} Yogesh{" "}
              {t("treasuryOverview:on")}
              <br /> Mar 18, 2022, 12:00 PM
            </div>
          </div>
          <div className="flex w-full items-center">
            <div className="w-1/2 flex items-center gap-x-2">
              <Button
                title={`${t("treasuryOverview:sign")}`}
                startIcon={<Icons.EditIcon />}
                size="small"
                onClick={() => dispatch(showSignModal("test"))}
              />
              <Button
                title={`${t("treasuryOverview:reject")}`}
                startIcon={<Icons.CrossIcon />}
                size="small"
                onClick={() => dispatch(showRejectModal("test"))}
              />
            </div>
            <div className="w-1/2 pl-3 pr-2">
              <div className="flex items-center gap-x-0.5 text-caption text-content-secondary max-w-max">
                {t("treasuryOverview:confirmation")}: 2/4{" "}
                <div
                  ref={confirmationDialogRef}
                  className="relative group"
                  onMouseOver={() => setToggleConfirmationDialog(true)}
                  onMouseLeave={() => setToggleConfirmationDialog(false)}
                >
                  <span className="w-5 h-5 rounded transition group-hover:bg-background-light grid place-content-center cursor-pointer">
                    <Icons.InformationIcon className="w-4 h-4 text-content-contrast" />
                  </span>
                  {/* Dropdown */}
                  <CollapseDropdown
                    show={toggleConfirmationDialog}
                    className="top-4 w-[436px] bg-transparent divide-y-0"
                    onHover={true}
                  >
                    <div className="p-6 rounded-lg bg-background-light border-b-0">
                      <div className="flex flex-col gap-y-6 text-subtitle-sm font-medium">
                        <div className="flex flex-col gap-y-4">
                          {/* Signed Owners */}
                          <div className="flex gap-x-8">
                            <div className="w-24 text-content-secondary">
                              {t("transactions:table.signed-by")}
                            </div>
                            <div className="grid gap-y-4">
                              {[1, 2, 3].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center  gap-x-2 text-content-primary"
                                >
                                  <Image
                                    layout="fixed"
                                    alt="Owner Logo"
                                    src={
                                      [
                                        Images.Avatar1,
                                        Images.Avatar2,
                                        Images.Avatar4
                                      ][item % 3]
                                    }
                                    height={24}
                                    width={24}
                                    className="rounded-full flex-shrink-0"
                                  />
                                  <div className="">
                                    <span data-tip="0x4f10x4f1U700eU700e">
                                      {toSubstring(
                                        "0x4f10x4f1U700eU700e",
                                        5,
                                        true
                                      )}
                                    </span>
                                  </div>
                                  <div className="text-content-tertiary">
                                    {moment("20220620", "YYYYMMDD").fromNow()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* ------------- */}
                        <div className="flex flex-col gap-y-4">
                          {/* Total Amount */}
                          <div className="flex gap-x-8">
                            <div className="w-24 text-content-secondary">
                              {t("transactions:table.remaining")}
                            </div>

                            <div className="grid gap-y-4">
                              <div className="text-content-primary">
                                3 out of 4 Owners
                              </div>
                              {[1].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center  gap-x-2 text-content-primary"
                                >
                                  <Image
                                    layout="fixed"
                                    alt="Owner Logo"
                                    src={
                                      [
                                        Images.Avatar1,
                                        Images.Avatar2,
                                        Images.Avatar4
                                      ][item % 3]
                                    }
                                    height={24}
                                    width={24}
                                    className="rounded-full"
                                  />
                                  <div className="">
                                    <span data-tip="0x4f10x4f1U700eU700e">
                                      {toSubstring(
                                        "0x4f10x4f1U700eU700e",
                                        5,
                                        true
                                      )}
                                    </span>
                                  </div>
                                  <div className="text-content-tertiary">
                                    {moment("20220620", "YYYYMMDD").fromNow()}
                                  </div>
                                </div>
                              ))}
                              <div className="text-content-primary">
                                <Button
                                  title={`${t(
                                    "transactions:table.show-all-remaining"
                                  )}`}
                                  size="small"
                                  endIcon={
                                    <Icons.ArrowDownIcon className="text-content-contrast" />
                                  }
                                  onClick={() =>
                                    setShowAllRemaining(!showAllRemaining)
                                  }
                                />
                              </div>
                              {showAllRemaining && (
                                <div className="grid gap-y-4">
                                  {[1, 2, 3].map((item) => (
                                    <div
                                      key={item}
                                      className="flex items-center  gap-x-2 text-content-primary"
                                    >
                                      <Image
                                        layout="fixed"
                                        alt="Owner Logo"
                                        src={
                                          [
                                            Images.Avatar1,
                                            Images.Avatar2,
                                            Images.Avatar4
                                          ][item % 3]
                                        }
                                        height={24}
                                        width={24}
                                        className="rounded-full"
                                      />
                                      <div className="">
                                        <span data-tip="0x4f10x4f1U700eU700e">
                                          {toSubstring(
                                            "0x4f10x4f1U700eU700e",
                                            5,
                                            true
                                          )}
                                        </span>
                                      </div>
                                      <div className="text-content-tertiary">
                                        {moment(
                                          "20220620",
                                          "YYYYMMDD"
                                        ).fromNow()}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapseDropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
