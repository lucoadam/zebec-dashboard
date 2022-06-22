import React, { FC } from "react";
import { ButtonProps, ButtonSize, ButtonVariant } from "./Button.d";

const getButtonSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return `px-6 py-2 text-button font-semibold gap-x-2`;
    case "small":
      return `px-2 py-1 text-button-sm font-medium gap-x-1`;
    default:
      return null;
  }
};

const getButtonIconStyles = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return `text-base`;
    case "small":
      return `text-sm`;
    default:
      return null;
  }
};

const getButtonVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case "default":
      return `outline outline-1 outline-outline outline-offset-[-1px]`;
    case "gradient":
      return `primary-gradient-border focus:outline-0`;
    default:
      return null;
  }
};

export const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    title,
    size = "medium",
    variant = "default",
    StartIcon,
    EndIcon,
    className,
    btnClassName,
    ...rest
  } = props;

  const sizeStyles = getButtonSizeStyles(size);
  const iconSizeStyles = getButtonIconStyles(size);
  const variantStyles = getButtonVariantStyles(variant);

  const isFullWidth = className?.includes("w-full");


  return (
    <>
      <div className={`button-wrapper ${variant} ${
            className ?? ""
          }`}>
        <button
          className={`flex justify-center items-center text-content-primary bg-background-secondary focus:bg-background-tertiary hover:bg-background-tertiary rounded-lg whitespace-nowrap ${sizeStyles} ${variantStyles} ${isFullWidth ? "w-full" : ""} ${btnClassName}`}
          {...rest}
        >
          {children ? (
            children
          ) : (
            <>
              {StartIcon && (
                <span className={`${iconSizeStyles}`}>
                  <StartIcon />
                </span>
              )}
              {title}
              {EndIcon && (
                <span className={`${iconSizeStyles}`}>
                  <EndIcon />
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
};
