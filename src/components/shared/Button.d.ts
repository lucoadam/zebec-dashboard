import React, { ButtonHTMLAttributes } from "react"
export type ButtonSize = "medium" | "small"
export type ButtonVariant = "default" | "gradient" | "danger"
export type ButtonShape = "circle" | "round"
export type IconButtonVariant = "default" | "solid" | "outlined" | "plain"

interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

interface ButtonChildrenProps extends ButtonBaseProps {
  children: React.ReactNode
  title?: never
}
interface ButtonTitlenProps extends ButtonBaseProps {
  children?: never
  title?: string
}

export type ButtonProps = ButtonChildrenProps | ButtonTitlenProps

interface IconButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: IconButtonVariant
  shape?: ButtonShape
}

interface IconButtonChildrenProps extends IconButtonBaseProps {
  children: React.ReactNode
  icon?: never
}
interface IconButtonIconProps extends IconButtonBaseProps {
  children?: never
  icon: JSX.Element
}

export type IconButtonProps = IconButtonChildrenProps | IconButtonIconProps
