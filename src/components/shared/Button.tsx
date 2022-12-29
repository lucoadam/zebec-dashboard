import React, { FC } from "react"
import { twMerge } from "tailwind-merge"
import { ButtonProps, ButtonSize, ButtonVariant } from "./Button.d"
import * as Icons from "assets/icons"
import { useCurrentTheme } from "hooks"

const getButtonSizeStyles = (size: ButtonSize, variant: ButtonVariant) => {
  switch (size) {
    case "medium":
      return `px-6 text-button font-semibold gap-x-2 ${
        variant === "gradient" ? "py-1.5" : "py-2"
      }`
    case "small":
      return `px-2 text-button-sm font-medium gap-x-1 ${
        variant === "gradient" ? "py-[3px]" : "py-[5px]"
      }`
    default:
      return null
  }
}

const getButtonIconStyles = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return `text-base`
    case "small":
      return `text-sm`
    default:
      return null
  }
}

const getButtonVariantStyles = (
  variant: ButtonVariant,
  theme: string | undefined
) => {
  switch (variant) {
    case "default":
      return `outline outline-1 outline-outline outline-offset-[-1px] bg-background-secondary focus:bg-background-tertiary hover:bg-background-tertiary`
    case "gradient":
      return theme === "dark"
        ? `primary-gradient-border focus:outline-0`
        : `bg-primary hover:bg-primary-dark p-0.5`
    case "danger":
      return `bg-error focus:outline-0`
    default:
      return null
  }
}

export const Button: FC<ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    props: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ): JSX.Element => {
    const {
      children,
      title,
      size = "medium",
      variant = "default",
      className,
      childrenClassName,
      startIcon,
      endIcon,
      loading,
      disabled,
      ...rest
    } = props
    const { currentTheme } = useCurrentTheme()

    const sizeStyles = getButtonSizeStyles(size, variant)
    const iconSizeStyles = getButtonIconStyles(size)
    const variantStyles = getButtonVariantStyles(variant, currentTheme)

    return (
      <>
        <button
          className={twMerge(
            `rounded-lg whitespace-nowrap transition duration-300 text-content-primary disabled:text-content-secondary dark:disabled:text-[#ffffff80] disabled:cursor-not-allowed ${variantStyles}`,
            className ?? ""
          )}
          {...rest}
          ref={ref}
          disabled={disabled || loading}
        >
          {children ? (
            children
          ) : (
            <div
              className={twMerge(
                `flex items-center justify-center ${sizeStyles}`,
                childrenClassName ?? ""
              )}
            >
              {startIcon && (
                <span className={`${iconSizeStyles}`}>{startIcon}</span>
              )}
              {title}
              {endIcon && (
                <span className={`${iconSizeStyles}`}>{endIcon}</span>
              )}
              {loading && (
                <span className={`${iconSizeStyles}`}>
                  <Icons.Loading />
                </span>
              )}
            </div>
          )}
        </button>
      </>
    )
  }
)

Button.displayName = "Button"
