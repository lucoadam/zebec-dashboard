import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import {
  IconButtonProps,
  IconButtonVariant,
  ButtonSize,
  ButtonShape,
} from "./Button.d";

const getIconButtonSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return `w-7 h-7`;
    case "small":
      return `w-4 h-4`;
    default:
      return null;
  }
};

const getIconButtonVariantStyles = (variant: IconButtonVariant) => {
  switch (variant) {
    case "default":
    case "solid":
      return `border border-outline bg-background-secondary`;
    case "outlined":
      return `border border-outline bg-transparent`;
    case "plain":
    default:
      return null;
  }
};

const getIconButtonShapeStyles = (shape: ButtonShape) => {
  switch (shape) {
    case "circle":
      return `rounded-full`;
    case "round":
      return `rounded-lg`;
    default:
      return null;
  }
};

export const IconButton: FC<IconButtonProps> = (props) => {
  const {
    children,
    variant = "default",
    size = "medium",
    shape = "circle",
    className,
    icon,
    ...rest
  } = props;

  const sizeStyles = getIconButtonSizeStyles(size);
  const variantStyles = getIconButtonVariantStyles(variant);
  const shapeStyles = getIconButtonShapeStyles(shape);

  return (
    <>
      <button
        className={twMerge(
          `grid place-content-center text-content-primary hover:text-primary-contrast text-sm focus:outline-0 ${sizeStyles} ${variantStyles} ${shapeStyles}`,
          className ?? "",
        )}
        {...rest}
      >
        {children ? children : icon}
      </button>
    </>
  );
};
