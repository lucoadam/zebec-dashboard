import React, { FC, Fragment } from "react";
import { Transition } from "@headlessui/react";

interface CollapseDropdownProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

export const CollapseDropdown: FC<CollapseDropdownProps> = (props) => {
  const { children, show, className } = props;
  const defaultClasses = `top-7 right-0  bg-background-light divide-y divide-outline-secondary`;
  //   const defaultClasses = ``;
  return (
    <>
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-75"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-75"
      >
        <div
          className={`absolute flex flex-col rounded-lg ${defaultClasses} ${
            className && className
          }`}
        >
          {children}
        </div>
      </Transition>
    </>
  );
};
