import React, { ButtonHTMLAttributes } from "react";
export type ButtonSize = "medium" | "small";
export type ButtonVariant = "default" | "gradient" | "danger";
export type ButtonShape = "circle" | "round";
export type IconButtonVariant = "default" | "solid" | "outlined" | "plain";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  title?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  startIcon?: React.Element;
  endIcon?: React.Element;
}

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: ButtonSize;
  variant?: IconButtonVariant;
  shape?: ButtonShape;
  icon?: React.Element;
}
