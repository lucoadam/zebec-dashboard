import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useAppDispatch, useAppSelector } from "app/hooks"
import NotificationsComponent from "components/notifications/Notifications"
import { updateWidth } from "features/layout/layoutSlice"
import { useClickOutside } from "hooks"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { FC, useEffect, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import * as Icons from "../../assets/icons"
import * as Images from "../../assets/images"
import { Button, CollapseDropdown, IconButton } from "../shared"
import NavGroup from "./NavGroup"
import NavLink from "./NavLink"
import Profile from "./Profile"
import { getMainRoutes, getMenuRoutes } from "./routes"
import WalletNotConnectedModal from "./WalletNotConnectedModal"

const Navbar: FC = () => {
  const { theme, setTheme, systemTheme } = useTheme()
  const useWalletObject = useWallet()
  const useWalletModalObject = useWalletModal()

  const [mounted, setMounted] = useState<boolean>(false)
  // const [width, setWidth] = useState<number>(0)
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const width = useAppSelector((state) => state.layout.width)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setMounted(true)
    dispatch(updateWidth(window.outerWidth))
    window.addEventListener("resize", () => {
      dispatch(updateWidth(window.outerWidth))
    })
  }, [dispatch])
  const [toggleAddressDropdown, setToggleAddressDropdown] =
    useState<boolean>(false)

    const handleClose = () => {
      setToggleAddressDropdown(false)
    }
    const AddressDropdownWrapperRef = useRef(null)
  
    //handle clicking outside
    useClickOutside(AddressDropdownWrapperRef, {
      onClickOutside: handleClose
    })

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

  return (
    <>
      <nav className="shadow-2 px-4 py-4" >
        <div className="flex justify-between gap-x-4 lg:justify-center items-center relative">
          {/* Logo */}
          <div className="flex flex-col lg:absolute lg:left-0">
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
            <Link href="/send">
              <Button
                title="Send"
                variant="gradient"
                endIcon={<Icons.ArrowUpRightIcon />}
              />
            </Link>
          </div>
          
        

          <div className="flex items-center gap-x-3 lg:absolute lg:right-0">
          <div className="text-content-primary" 
          onClick={()=>setToggleAddressDropdown(!toggleAddressDropdown)}>
            <Icons.NotificationIcon/>


          </div>
            <>{themeChanger()}</>
            {!useWalletObject.connected ? (
              <Button
                title="Connect Wallet"
                variant="gradient"
                onClick={handleConnectWallet}
              />
            ) : (
              <Profile />
            )}
            <div className="lg:hidden">
              <IconButton
                icon={<Icons.MenuIcon />}
                variant="plain"
                size="medium"
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
          </div>
          </div>

        {showMenu && (
          <div className={`px-6 divide-y divide-outline`}>
            {getMenuRoutes(width).map((route, index) => (
              <div className="py-4" key={index}>
                <NavLink key={index} {...route} />
              </div>
            ))}
          </div>
        )}
        <WalletNotConnectedModal />
      </nav>
      <div className="relative" >
            <CollapseDropdown
            show={toggleAddressDropdown}
            className=" rounded-lg top-1 right-4 "
          >
            <NotificationsComponent/>
          </CollapseDropdown>
          </div>
    </>
  )
}

export default Navbar
