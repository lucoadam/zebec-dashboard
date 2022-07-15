import React, { useState } from "react"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { treasuries } from "fakedata"
import Image, { StaticImageData } from "next/image"
import CopyButton from "components/shared/CopyButton"
import * as AvatarImages from "assets/images/avatars"
import { toSubstring } from "utils"
import { Button, Modal } from "components/shared"

const ArchiveSafeLists = () => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]
  const [isOpen, setIsOpen] = useState(false)

  function toggleModal() {
    setIsOpen(!isOpen)
  }
  const { t } = useTranslation("archiveTreasury")
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {treasuries.map((treasury, index) => {
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
                  {treasury.safe_name}
                </div>
                <div className="flex gap-x-3 items-center">
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.UserGroupIcon className="text-base" />
                    <div>{treasury.owners.length} Owners</div>
                  </div>
                  <div className="flex  gap-x-1.5 items-center text-content-primary">
                    <Icons.NotebookIcon className="text-base" />
                    <div>{toSubstring(treasury.multisig_vault, 6, true)}</div>
                    <CopyButton content={treasury.multisig_vault} />
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Button
                  title={t("unarchive-safe")}
                  className="w-full"
                  endIcon={<Icons.Unarchive className="text-content-primary" />}
                  onClick={() => {
                    setIsOpen(true)
                  }}
                />
              </div>
            </div>
          )
        })}
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
              title={t("yes-archive")}
            />
          </div>
          <div className="">
            <Button
              className={`w-full font-semibold`}
              title={t("cancel")}
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
