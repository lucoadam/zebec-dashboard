import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import * as Icons from "assets/icons";
import Setting from "./components/Setting";

let categories = [
  {
    title: "Overview",
    Icon: Icons.EyeOpenIcon,
    Component: Setting,
  },
  {
    title: "Transactions",
    Icon: Icons.TransactionIcon,
    badge: 3,
    Component: Fragment,

  },
  {
    title: "Settings",
    Icon: Icons.GearringAltIcon,
    Component: Setting,

  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TreasuryDetail() {
  return (
    <div className="w-full px-2 pb-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex max-w-md space-x-1 rounded-xl p-1">
          {categories.map((category) => (
            <Tab key={category.title} as={Fragment}>
              {({ selected }) => (
                <div
                  className={classNames(
                    "w-full rounded-lg py-2.5 px-[24px] text-sm font-medium leading-5 text-content-secondary flex justify-center items-center",
                    " focus:outline-none",
                    selected
                      ? "bg-background-tertiary shadow"
                      : "hover:bg-white/[0.12] cursor-pointer"
                  )}
                >
                  <category.Icon
                    className={classNames(
                      "mr-2",
                      selected ? "text-primary" : ""
                    )}
                  />
                  {category.title}{" "}
                  {category.badge ? (
                    <div
                      className={classNames(
                        "ml-2 self-center px-[2px] py-[1px] text-xs font-semibold mb-[2px] text-center rounded-full w-[16px] h-[16px]",
                        selected
                          ? "bg-background-primary"
                          : "bg-background-tertiary"
                      )}
                    >
                      {category.badge}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {categories.map(({ Component }, idx) => (
            <Tab.Panel
              key={idx}
              as={Fragment}
              //   className={classNames(
              //     "rounded-xl bg-white p-3",
              //     "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              //   )}
            >
              <Component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
