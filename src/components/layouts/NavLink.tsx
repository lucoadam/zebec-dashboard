import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { RouteProps } from "./routes";

const NavLink: FC<RouteProps> = (props) => {
  const { name, path, Icon } = props;
  const router = useRouter();
  const { t } = useTranslation("common");

  //isActive state for active link
  const isActive = router.pathname === path;

  return (
    <>
      <Link href={path ? path : "/"}>
        <a className="flex gap-x-3 text-subtitle-sm font-medium group focus:outline-none">
          <div
            className={`h-6 w-6 rounded-md bg-background-secondary text-base grid place-content-center`}
          >
            <Icon
              className={`transition duration-200 group-focus:text-primary group-hover:text-primary ${
                isActive ? "text-primary" : "text-content-contrast"
              }`}
            />
          </div>
          <span
            className={`transition duration-200 group-focus:text-content-primary group-hover:text-content-primary whitespace-nowrap ${
              isActive ? "text-content-primary" : "text-content-secondary"
            }`}
          >
            {t(`nav.${name}`)}
          </span>
        </a>
      </Link>
    </>
  );
};

export default NavLink;
