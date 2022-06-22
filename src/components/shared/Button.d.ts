import { ButtonHTMLAttributes } from "react";
export type ButtonSize = "medium" | "small" | undefined;
export type ButtonVariant = "default" | "gradient" | undefined;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  title?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  StartIcon?: React.ElementType;
  EndIcon?: React.ElementType;
  btnClassName?: string;
}
