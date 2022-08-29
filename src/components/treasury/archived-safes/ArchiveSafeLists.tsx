import React, { useState } from "react"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import Image, { StaticImageData } from "next/image"
import CopyButton from "components/shared/CopyButton"
import * as AvatarImages from "assets/images/avatars"
import { toSubstring } from "utils"
import { Button, EmptyDataState, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { updateTreasury } from "features/treasury/treasurySlice"

const ArchiveSafeLists = () => {
  const { t } = useTranslation("archiveTreasury")
  const dispatch = useAppDispatch()
  const { archivedTreasuries } = useAppSelector((state) => state.treasury)

  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [selectedTreasury, setSelectedTreasury] = useState<string>("")

  function toggleModal() {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {archivedTreasuries.results.length === 0 ? (
          <>
            <div className="md:col-span-2 lg:col-span-3">
              <EmptyDataState message={`${t("no-treasury")}`} />
            </div>
          </>
        ) : (
          archivedTreasuries.results.map((treasury, index) => {
            return (
              <div
                className="p-6 bg-background-secondary rounded cursor-pointer"
                key={`archive-${index}`}
              >
                <Image
                  src={Avatars[index % 3]}
                  layout="fixed"
                  width={48}
                  height={48}
                  alt={`Avatar ${index + 1}`}
                />
                <div className="flex flex-col gap-y-4 mt-6">
                  <div className="text-subtitle text-content-primary font-semibold">
                    {treasury.name}
                  </div>
                  <div className="flex gap-x-3 items-center flex-wrap">
                    <div className="flex gap-x-1.5 items-center text-content-primary">
                      <Icons.UserGroupIcon className="text-base" />
                      <div>{treasury.owners.length} Owners</div>
                    </div>
                    <div className="flex  gap-x-1.5 items-center text-content-primary">
                      <Icons.NotebookIcon className="text-base" />
                      <div>
                        {toSubstring(treasury.treasury_address, 6, true)}
                      </div>
                      <CopyButton content={treasury.treasury_address} />
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <Button
                    title={`${t("unarchive-safe")}`}
                    className="w-full"
                    endIcon={
                      <Icons.Unarchive className="text-content-primary" />
                    }
                    onClick={() => {
                      setSelectedTreasury(treasury.uuid)
                      setIsOpen(true)
                    }}
                  />
                </div>
              </div>
            )
          })
        )}
        <Modal
          show={isOpen}
          toggleModal={toggleModal}
          className="rounded "
          hasCloseIcon={false}
          size="small"
        >
          <div className="text-content-primary pb-3 text-subtitle font-semibold">
            {t("archive-modal-header")}
          </div>
          <div className="text-content-primary text-caption pb-3">
            {t("archive-modal-subtitle")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              className={`w-full font-semibold`}
              variant="gradient"
              title={`${t("yes-archive")}`}
              onClick={() => {
                const data = {
                  uuid: selectedTreasury,
                  archived: false
                }
                dispatch(updateTreasury(data))
              }}
            />
          </div>
          <div className="">
            <Button
              className={`w-full font-semibold`}
              title={`${t("cancel")}`}
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            />
          </div>
        </Modal>
      </div>
    </>
  )
}

export default ArchiveSafeLists
