/* eslint-disable @next/next/no-img-element */
import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { initTransferNftFromTreasury } from "application"
import * as Icons from "assets/icons"
import {
  Button,
  CollapseDropdown,
  EmptyDataState,
  IconButton,
  InputField,
  Toggle
} from "components/shared"
import {
  fetchFilteredAddressBook,
  setFilteredPagination
} from "features/address-book/addressBookSlice"
import { useClickOutside } from "hooks"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { useContext } from "react"
import { FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { sendNFTSchema } from "utils/validations/sendNFTSchema"
import { SendNFTFormData, SendNFTProps } from "./TreasuryNFTStream.d"

let searchData = ""
let addressCurrentPage = 1

export const SendNFT: FC<SendNFTProps> = ({ className, nft, changeNFT }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const {
    filteredAddressBooks: addressBook,
    addressBooks: mainAddressBook,
    filteredPagination
  } = useAppSelector((state) => state.address)
  const { isSigned } = useAppSelector((state) => state.common)
  const { treasuryToken } = useContext(ZebecContext)
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    resetField,
    reset
  } = useForm<SendNFTFormData>({
    mode: "onChange",
    resolver: yupResolver(sendNFTSchema)
  })

  const receiverDropdownWrapper = useRef(null)

  const [receiverSearchData, setReceiverSearchData] = useState("")
  const [toggleChooseNFT, setToggleChooseNFT] = useState(true)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)

  const handleReceiverClose = () => {
    setToggleReceiverDropdown(false)
  }

  useEffect(() => {
    if (nft) {
      setValue("nftAddress", nft.address)
      setValue("nftImageUrl", nft.image)
      setValue("nftName", nft.name)
      setToggleChooseNFT(true)
    } else {
      resetField("nftAddress")
      setToggleChooseNFT(true)
    }
  }, [nft, setValue, trigger, resetField])

  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose
  })

  const sendNftCallback = (message: "success" | "error") => {
    if (message === "success" && activeTreasury) {
      reset()
      changeNFT && changeNFT(undefined)
      router.push(`/treasury/${activeTreasury.uuid}/transactions#nfts`)
    }
  }

  const onSubmit = (data: SendNFTFormData) => {
    const transferNftData = {
      sender: (publicKey as PublicKey).toString(),
      safe_address: activeTreasury?.treasury_address || "",
      safe_data_account: activeTreasury?.treasury_escrow || "",
      receiver: data.receiver,
      amount: 1,
      token_mint_address: data.nftAddress,
      nft_name: data.nftName,
      nft_img_url: data.nftImageUrl,
      transaction_name: data.transactionName
    }
    if (treasuryToken)
      dispatch(
        initTransferNftFromTreasury({
          data: transferNftData,
          treasuryToken,
          callback: sendNftCallback
        })
      )
  }

  const toggleNFT = () => {
    resetField("nftAddress")
    if (toggleChooseNFT) {
      changeNFT && changeNFT(undefined)
    }
    setToggleChooseNFT(!toggleChooseNFT)
  }

  useEffect(() => {
    if (isSigned) {
      dispatch(
        setFilteredPagination({
          currentPage: 1,
          limit: 4,
          total: 0
        })
      )
      searchData = receiverSearchData
      addressCurrentPage = 1
      dispatch(
        fetchFilteredAddressBook({
          search: receiverSearchData,
          page: 1,
          append: false
        })
      )
    }
  }, [dispatch, receiverSearchData, isSigned])

  useEffect(() => {
    addressCurrentPage = Number(filteredPagination.currentPage)
  }, [filteredPagination.currentPage])

  useEffect(() => {
    if (toggleReceiverDropdown) {
      // detect end of scroll
      setTimeout(() => {
        const element = document.querySelector(
          ".address-book-list"
        ) as HTMLElement
        element?.addEventListener("scroll", () => {
          if (
            element.scrollTop + element.clientHeight + 5 >=
            element.scrollHeight
          ) {
            dispatch(
              fetchFilteredAddressBook({
                search: searchData,
                page: addressCurrentPage + 1,
                append: true
              })
            )
          }
        })
      }, 200)
    }
    // eslint-disable-next-line
  }, [toggleReceiverDropdown])

  const resetForm = () => {
    reset()
    changeNFT && changeNFT(undefined)
  }

  return (
    <>
      <div
        className={twMerge(
          "bg-background-secondary rounded-[4px] p-10",
          className ?? ""
        )}
      >
        <div className="flex justify-between">
          <div className="text-heading-4 text-content-primary font-semibold">
            {t("send:nft")}
          </div>
          <IconButton
            data-tip="Reset"
            icon={<Icons.RefreshIcon />}
            className="w-7 h-7"
            onClick={resetForm}
          />
        </div>

        <div className="text-caption text-content-tertiary font-normal pt-2">
          {t("send:nft-description")}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          autoComplete="off"
        >
          {/* Transaction Name */}
          <div className="mt-12">
            <InputField
              label={t("send:transaction-name")}
              className="relative text-content-primary"
              error={false}
              labelMargin={12}
              helper={t(errors.transactionName?.message?.toString() ?? "")}
            >
              <div>
                <input
                  className={`!pr-[124px] w-full h-[40px] ${
                    !!errors.transactionName && "error"
                  }`}
                  placeholder={t("send:transaction-name")}
                  type="text"
                  {...register("transactionName")}
                />
              </div>
            </InputField>
          </div>
          {/**Receiver Wallet */}
          <div className="relative" ref={receiverDropdownWrapper}>
            <label
              className={`ml-3 text-content-primary text-xs font-medium mb-1`}
            >
              {t("send:receiver-wallet")}
            </label>
            <div className="relative text-content-primary">
              <input
                type="text"
                className={`h-[40px] w-full !pr-12 ${
                  !!errors.receiver && "error"
                }`}
                placeholder={t("send:receiver-wallet-placeholder")}
                {...register("receiver")}
              />
              <Icons.CheveronDownIcon
                onClick={() => setToggleReceiverDropdown((prev) => !prev)}
                className="hover:cursor-pointer absolute w-6 h-6 top-2 right-4"
              />
            </div>
            {!!errors.receiver && (
              <p className="text-content-secondary text-xs ml-[12px] mt-1">
                {t(errors.receiver?.message?.toString() ?? "")}
              </p>
            )}
            <CollapseDropdown
              show={toggleReceiverDropdown}
              className="mt-8 w-full z-[99]"
              position="left"
            >
              <div className="rounded-lg bg-background-primary border border-outline">
                {mainAddressBook.length > 0 || receiverSearchData ? (
                  <>
                    <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                    <input
                      className="is-search w-full h-[48px] bg-background-primary"
                      placeholder={t("send:search-wallet")}
                      type="text"
                      onChange={(e) => setReceiverSearchData(e.target.value)}
                    />
                    <div className="divide-y address-book-list divide-outline max-h-[206px] overflow-auto">
                      {addressBook.map((user) => (
                        <div
                          key={user.address}
                          onClick={(event) => {
                            event.stopPropagation()
                            setToggleReceiverDropdown(false)
                            setValue("receiver", user.address)
                            trigger("receiver")
                          }}
                          className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light"
                        >
                          <div className="text-sm text-content-primary">
                            {user.name}
                          </div>
                          <div className="text-caption text-content-tertiary">
                            {toSubstring(user.address, 28, false)}
                          </div>
                        </div>
                      ))}
                      {addressBook.length !== filteredPagination.total && (
                        <div className="flex justify-center items-center py-3">
                          <Icons.Loading className="text-content-primary" />
                        </div>
                      )}
                      {addressBook.length === 0 && receiverSearchData && (
                        <div className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center">
                          <div className="text-content-contrast">
                            {t("common:no-receiver-found")}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyDataState
                    message={t(
                      "createTreasury:second-steper.empty-address-book"
                    )}
                    className="h-fit w-full rounded !px-10 !py-10 bg-background-primary text-center"
                  />
                )}
              </div>
            </CollapseDropdown>
          </div>

          {/** NFT address */}
          <div>
            <InputField
              label={t("send:nft-address")}
              className="relative text-content-primary"
              error={false}
              labelMargin={12}
              disabled={toggleChooseNFT}
              helper={t(errors.nftAddress?.message?.toString() ?? "")}
            >
              <div>
                <input
                  className={`!pr-[124px] w-full h-[40px] ${
                    !!errors.nftAddress && "error"
                  }`}
                  placeholder={t("send:enter-nft-address")}
                  type="text"
                  {...register("nftAddress")}
                  disabled={toggleChooseNFT}
                />
              </div>
            </InputField>
          </div>
          <div className="grid lg:grid-cols-2 gap-3">
            <Toggle
              checked={toggleChooseNFT}
              text={t("send:choose-nft")}
              onChange={toggleNFT}
              disabled={true}
            />
          </div>
          {/* Send button */}
          <div>
            <Button
              className="w-full"
              variant="gradient"
              title={`${t("send:send")}`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}
