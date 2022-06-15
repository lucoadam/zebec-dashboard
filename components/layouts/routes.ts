import React from "react";
import * as NavIcons from "../../assets/icons/nav-icons";

export interface RouteProps {
  name: string;
  path?: string;
  Icon: React.ElementType;
  type: "link" | "group";
}

export interface RoutesArrayProps extends RouteProps {
  children?: RouteProps[];
}

export const routes: RoutesArrayProps[] = [
  {
    name: "dashboard",
    path: "/",
    Icon: NavIcons.HomeIcon,
    type: "link",
  },
  {
    name: "treasury",
    path: "/treasury",
    Icon: NavIcons.BoxFrameIcon,
    type: "link",
  },
  {
    name: "transactions",
    path: "/transactions",
    Icon: NavIcons.TransactionIcon,
    type: "link",
  },
  {
    name: "yeild-farming",
    path: "/yeild-farming",
    Icon: NavIcons.CoinIcon,
    type: "link",
  },
  {
    name: "dca",
    path: "/dca",
    Icon: NavIcons.CoinIcon,
    type: "link",
  },
  {
    name: "more",
    Icon: NavIcons.ThunderIcon,
    type: "group",
    children: [
      {
        name: "address-book",
        path: "/address-book",
        Icon: NavIcons.PhoneBookIcon,
        type: "link",
      },
    ],
  },
];
