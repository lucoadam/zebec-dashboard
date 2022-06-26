import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonProps, ButtonSize, ButtonVariant } from "./Button.d";

const getButtonSizeStyles = (size: ButtonSize, variant: ButtonVariant) => {
  switch (size) {
    case "medium":
      return `px-6 text-button font-semibold gap-x-2 ${
        variant === "gradient" ? "py-1.5" : "py-2"
      }`;
    case "small":
      return `px-2 text-button-sm font-medium gap-x-1 ${
        variant === "gradient" ? "py-[3px]" : "py-[5px]"
      }`;
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
      return `outline outline-1 outline-outline outline-offset-[-1px] bg-background-secondary focus:bg-background-tertiary hover:bg-background-tertiary`;
    case "gradient":
      return `primary-gradient-border focus:outline-0`;
    case "danger":
      return `bg-error focus:outline-0`;
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
    className,
    startIcon,
    endIcon,
    ...rest
  } = props;

  const sizeStyles = getButtonSizeStyles(size, variant);
  const iconSizeStyles = getButtonIconStyles(size);
  const variantStyles = getButtonVariantStyles(variant);

  return (
    <>
      <button
        className={twMerge(
          `rounded-lg whitespace-nowrap transition duration-300 text-content-primary hover:text-primary-contrast ${variantStyles}`,
          className ?? "",
        )}
        {...rest}
      >
        {children ? (
          children
        ) : (
          <div className={`flex items-center justify-center ${sizeStyles}`}>
            {startIcon && (
              <span className={`${iconSizeStyles}`}>{startIcon}</span>
            )}
            {title}
            {endIcon && <span className={`${iconSizeStyles}`}>{endIcon}</span>}
          </div>
        )}
      </button>
    </>
  );
};
