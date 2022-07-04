import { Fragment, useState } from "react";
// import { Tab } from "@headlessui/react";
import * as Icons from "assets/icons";
import Setting from "./components/Setting";
import Overview from "./components/Overview";
import { useTranslation } from "next-i18next";
import { Tab } from "components/shared";

let categories = [
  {
    title: "overview",
    icon: <Icons.EyeOpenIcon />,
    count: 0,
    Component: <Overview />,
  },
  {
    title: "transactions",
    icon: <Icons.TransactionIcon />,
    count: 3,
    Component: <Fragment />,
  },
  {
    title: "settings",
    icon: <Icons.GearringAltIcon />,
    count: 0,
    Component: <Setting />,
  },
];

export default function TreasuryDetail() {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<number>(0);

  return (
    <div className="w-full pb-16 sm:px-0">
      {/* <Tab.Group> */}
      <div className="flex max-w-md space-x-1 rounded-xl">
        {categories.map((category, index) => (
          <Tab
            key={category.title}
            type="solid"
            className="w-1/2"
            title={`${t(`treasury:${category.title.toLowerCase()}`)}`}
            isActive={activePage === index}
            startIcon={category.icon}
            count={category.count}
            onClick={() => setActivePage(index)}
          />
        ))}
      </div>
      {/* // </Tab.List> */}
      <div className=" mt-[40px]">
        {/* {categories.map(({ Component }, idx) => ( */}
        {/* // <Tab.Panel
            //   key={idx}
            //   as={Fragment}
            //   //   className={classNames(
            //   //     "rounded-xl bg-white p-3",
            //   //     "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            //   //   )}
            // > */}
        {categories[activePage].Component}
        {/* </Tab.Panel>
          ))} */}
      </div>
    </div>
  );
}
