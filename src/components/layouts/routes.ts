import * as NavIcons from "../../assets/icons/nav-icons";
import { DeviceRoutes, RoutesArrayProps } from "./routes.d";

const routesArray: RoutesArrayProps[] = [
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
    name: "address-book",
    path: "/address-book",
    Icon: NavIcons.PhoneBookIcon,
    type: "link",
  },
  {
    name: "settings",
    path: "/settings",
    Icon: NavIcons.GearringIcon,
    type: "link",
  },
];

const deviceRoutes: DeviceRoutes[] = [
  {
    width: 1024,
    main: [],
    more: [],
    menu: [
      "dashboard",
      "treasury",
      "transactions",
      "yeild-farming",
      "dca",
      "address-book",
      "settings",
    ],
  },
  {
    width: 1280,
    main: ["dashboard", "treasury", "transactions"],
    more: ["yeild-farming", "dca", "address-book", "settings"],
    menu: [],
  },
  {
    width: 1440,
    main: ["dashboard", "treasury", "transactions", "yeild-farming"],
    more: ["dca", "address-book", "settings"],
    menu: [],
  },
  {
    width: Number.MAX_VALUE,
    main: ["dashboard", "treasury", "transactions", "yeild-farming", "dca"],
    more: ["address-book", "settings"],
    menu: [],
  },
];

export const getMainRoutes = (width: number): RoutesArrayProps[] => {
  const routes =
    deviceRoutes.find((r) => width < r.width) ||
    deviceRoutes[deviceRoutes.length - 1];
  const mainSection = routesArray.filter((r) => routes.main.includes(r.name));
  const moreSection = routesArray.filter((r) => routes.more.includes(r.name));
  if (moreSection.length > 0) {
    mainSection.push({
      name: "more",
      Icon: NavIcons.ThunderIcon,
      type: "group",
      children: routesArray.filter((r) => routes.more.includes(r.name)),
    });
  }
  return mainSection;
};

export const getMenuRoutes = (width: number): RoutesArrayProps[] => {
  const routes =
    deviceRoutes.find((r) => width < r.width) ||
    deviceRoutes[deviceRoutes.length - 1];
  const menuSection = routesArray.filter((r) => routes.menu.includes(r.name));
  return menuSection;
};
