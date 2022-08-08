import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import NotificationsComponent from "components/notifications/Notifications"
import CopyButton from "components/shared/CopyButton"
import { updateWidth } from "features/layout/layoutSlice"
import { useClickOutside } from "hooks"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useEffect, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import { toSubstring } from "utils"
import { Button, IconButton, Sidebar } from "../shared"
import NavGroup from "./NavGroup"
import NavLink from "./NavLink"
import Profile from "./Profile"
import { getMainRoutes, getMenuRoutes } from "./routes"

const Navbar: FC = () => {
  const { theme, setTheme, systemTheme } = useTheme()
  const useWalletObject = useWallet()
  const useWalletModalObject = useWalletModal()

  const [mounted, setMounted] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const width = useAppSelector((state) => state.layout.width)
  const dispatch = useAppDispatch()

  const dropdownWrapperRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    dispatch(updateWidth(window.outerWidth))
    window.addEventListener("resize", () => {
      dispatch(updateWidth(window.outerWidth))
    })
  }, [dispatch])

  //theme toggle
  const themeChanger: () => JSX.Element | null = () => {
    if (!mounted) return null
    const currentTheme = theme === "system" ? systemTheme : theme
    if (currentTheme === "dark") {
      return (
        <IconButton
          icon={<Icons.DayIcon />}
          variant="plain"
          size="small"
          onClick={() => setTheme("light")}
        />
      )
    } else {
      return (
        <IconButton
          icon={<Icons.NightIcon />}
          variant="plain"
          size="small"
          onClick={() => setTheme("dark")}
        />
      )
    }
  }

  useEffect(() => {
    if (useWalletObject.connected) {
      setTimeout(() => {
        ReactTooltip.rebuild()
      }, 500)
    }
  }, [useWalletObject])

  const handleConnectWallet: () => void = () => {
    useWalletObject.wallet
      ? useWalletObject.connect()
      : useWalletModalObject.setVisible(!useWalletModalObject.visible)
  }

  useClickOutside(dropdownWrapperRef, {
    onClickOutside: () => {
      setShowMenu(false)
    }
  })

  const handleClose = () => {
    setShowMenu(false)
  }

  //handle change wallet
  const handleChangeWallet = () => {
    useWalletModalObject.setVisible(!useWalletModalObject.visible)
    handleClose()
  }

  //handle disconnect wallet
  const handleDisconnectWallet = () => {
    useWalletObject.disconnect()
    handleClose()
  }
  return (
    <>
      <nav className="bg-background-primary shadow-2 px-4 py-4 w-full">
        <div className="w-full flex justify-between gap-x-4 items-center">
          {/* Logo */}
          <div className="flex flex-row gap-8 items-center">
            <div className="flex flex-col">
              <Image
                src={Images.ZebecLogo}
                alt="Zebec Logo"
                layout="fixed"
                width={87}
                height={24}
              />
              <div className="ml-10 text-caption text-content-contrast">
                Mainnet Beta
              </div>
            </div>
            <div className="hidden md:block">{themeChanger()}</div>
          </div>

          {/* NavLinks */}
          <div className="flex items-center gap-x-4 xl:gap-x-8 ml-auto lg:ml-0">
            {getMainRoutes(width).map((route, index) => {
              switch (route.type) {
                case "link":
                  return <NavLink key={index} {...route} />
                case "group":
                  return <NavGroup key={index} {...route} />
              }
            })}

            <Icons.BellEditIcon className="cursor-pointer md:hidden text-content-primary w-6 h-6" />

            <Link href="/send">
              <Button
                title="Send"
                variant="gradient"
                endIcon={<Icons.ArrowUpRightIcon />}
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-x-[27px]">
              {!useWalletObject.connected ? (
                <Button
                  title="Connect Wallet"
                  variant="gradient"
                  onClick={handleConnectWallet}
                />
              ) : (
                <div className="flex gap-x-6">
                  <NotificationsComponent />
                  <Profile />
                </div>
              )}
            </div>
          </div>

          <div ref={dropdownWrapperRef} className="lg:hidden">
            <IconButton
              icon={<Icons.MenuIcon />}
              variant="plain"
              size="medium"
              onClick={() => setShowMenu(!showMenu)}
            />
            <Sidebar className="w-[290px] p-4" show={showMenu}>
              <div className={`flex gap-x-2 pb-6 px-4 mt-8`}>
                <Image
                  src={Images.Avatar1}
                  alt="Profile Avatar"
                  layout="fixed"
                  width={32}
                  height={32}
                  className={`${!useWalletObject.connected && "blur-[2px]"}`}
                />
                <div className="flex flex-1 justify-between items-center">
                  <div
                    className={`flex items-center gap-x-3 ${
                      !useWalletObject.connected && "blur-[2px]"
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div
                        data-tip={useWalletObject?.publicKey?.toString()}
                        className="text-avatar-title font-medium text-content-primary"
                      >
                        {toSubstring(
                          useWalletObject?.publicKey?.toString(),
                          4,
                          true
                        )}
                      </div>
                      <div className="text-caption leading-[14px] text-content-contrast whitespace-nowrap">
                        {useWalletObject?.wallet?.adapter.name} Wallet
                      </div>
                    </div>
                    <CopyButton
                      disabled={!useWalletObject.connected}
                      className="text-content-primary"
                      content={useWalletObject?.publicKey?.toString() ?? ""}
                    />
                  </div>
                  <div>{themeChanger()}</div>
                </div>
              </div>
              {getMenuRoutes(width).map((route, index) => (
                <div
                  className={`
                ${
                  (router.pathname === route.path ||
                    (route.path !== "/" &&
                      router.pathname.includes(route.path?.split("/")[1]))) &&
                  "bg-background-primary"
                }
                py-2 px-2 rounded-[4px]`}
                  key={index}
                >
                  <NavLink key={index} {...route} />
                </div>
              ))}
              <div className="border-t border-outline pt-6 mt-auto">
                {useWalletObject.connected ? (
                  <>
                    <Button
                      title="Change Wallet"
                      startIcon={<Icons.RefreshIcon />}
                      className="w-full mb-3 bg-background-primary"
                      onClick={handleChangeWallet}
                    />
                    <Button
                      title="Disconnect Wallet"
                      startIcon={<Icons.DisconnectIcon />}
                      className="w-full bg-background-primary"
                      onClick={handleDisconnectWallet}
                    />
                  </>
                ) : (
                  <Button
                    title="Connect Wallet"
                    variant="gradient"
                    className="w-full"
                    onClick={handleConnectWallet}
                  />
                )}
              </div>
            </Sidebar>
          </div>
        </div>
        {/* <WalletNotConnectedModal /> */}
      </nav>
    </>
  )
}

export default Navbar
