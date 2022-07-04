import React, { FC, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "./IconButton";
import * as Icons from "assets/icons";

type ModalSize = "small" | "medium" | "large";

interface ModalProps {
  show: boolean;
  size?: ModalSize;
  className?: string;
  toggleModal: () => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  hasCloseIcon?: boolean;
}

export const Modal: FC<ModalProps> = (props) => {
  const {
    show,
    size = "large",
    className,
    toggleModal,
    children,
    closeOnOutsideClick = false,
    hasCloseIcon = false,
  } = props;

  const sizeStyle =
    size === "medium"
      ? "max-w-[420px]"
      : size === "small"
      ? "max-w-[338px]"
      : "max-w-md";

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          className="relative z-10"
          onClose={closeOnOutsideClick ? toggleModal : () => false}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background-backdrop" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={twMerge(
                    `w-full transform overflow-hidden rounded-lg bg-background-secondary px-6 pt-6 pb-10 text-left shadow-backdrop align-middle transition-all ${sizeStyle}`,
                    className,
                  )}
                >
                  {hasCloseIcon && (
                    <IconButton
                      className="absolute top-1 right-1"
                      icon={<Icons.CrossIcon />}
                      onClick={toggleModal}
                    />
                  )}
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
