import { useTranslation } from "next-i18next"
import { FC, useRef, useState } from "react"
import * as Icons from "../../assets/icons"
import { CollapseDropdown } from "../shared"
import { RoutesArrayProps } from "./routes.d"
//hooks
import { useClickOutside } from "../../hooks"
import Link from "next/link"
import { useRouter } from "next/router"

const NavGroup: FC<RoutesArrayProps> = (props) => {
  const { name, Icon, children } = props
  const router = useRouter()
  const { t } = useTranslation("common")
  const navGroupDropdownWrapper = useRef(null)

  const [toggleNavGroupDropdown, setToggleNavGroupDropdown] =
    useState<boolean>(false)

  const handleClose = () => {
    setToggleNavGroupDropdown(false)
  }

  //handle clicking outside
  useClickOutside(navGroupDropdownWrapper, {
    onClickOutside: handleClose
  })

  return (
    <>
      <div className="relative" ref={navGroupDropdownWrapper}>
        {/* Nav Group Title */}
        <button
          type="button"
          onClick={() => setToggleNavGroupDropdown(!toggleNavGroupDropdown)}
          className="flex items-center gap-x-3 text-subtitle-sm font-medium group focus:outline-none cursor-pointer"
        >
          <div className="h-6 w-6 rounded-md bg-background-secondary text-content-contrast text-base grid place-content-center">
            <Icon className="transition duration-200 group-focus:text-primary group-hover:text-primary" />
          </div>
          <div className="flex items-center gap-x-1.5 text-content-secondary">
            <span className="transition duration-200 group-focus:text-content-primary group-hover:text-content-primary whitespace-nowrap">
              {t(`nav.${name}`)}
            </span>
            <Icons.CheveronDownIcon className="text-base" />
          </div>
        </button>
        {/* Nav Group Dropdown */}
        <CollapseDropdown show={toggleNavGroupDropdown}>
          {children?.map((link) => {
            const { name, path, Icon } = link
            const isActive =
              router.pathname === path ||
              (path !== "/" && router.pathname.includes(path?.split("/")[1]))
            return (
              <Link key={name} href={path ?? "/"}>
                <a className="py-3 pl-4 pr-6 flex items-center gap-x-2 text-subtitle-sm text-content-secondary font-medium group focus:outline-none">
                  <Icon
                    className={`w-5 h-5 transition duration-200 group-focus:text-primary group-hover:text-primary ${
                      isActive ? "text-primary" : "text-content-contrast"
                    }`}
                  />
                  <span
                    className={`transition duration-200 group-focus:text-content-primary group-hover:text-content-primary whitespace-nowrap`}
                  >
                    {t(`nav.${name}`)}
                  </span>
                </a>
              </Link>
            )
          })}
        </CollapseDropdown>
      </div>
    </>
  )
}

export default NavGroup
