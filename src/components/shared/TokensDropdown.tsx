import React, { FC } from "react"
import { CollapseDropdown } from "./CollapseDropdown"
import * as Icons from "assets/icons"
import { twMerge } from "tailwind-merge"

interface TokensDropdownProps {
  show: boolean
  className?: string
}

export const TokensDropdown: FC<TokensDropdownProps> = (props) => {
  const { show, className } = props
  return (
    <>
      {/* Tokens Dropdown */}
      <CollapseDropdown
        show={show}
        className={twMerge(
          `w-full border border-outline top-12 bg-background-primary overflow-hidden`,
          className
        )}
      >
        <div className="">
          <div className="flex items-center px-4.5 py-3 border-b border-outline">
            <Icons.SearchIcon className="text-base text-content-tertiary" />
            <input
              type="text"
              placeholder="Search Tokens"
              className="!rounded-b-none !border-0 !ring-0 !text-body !text-content-secondary"
            />
          </div>
          <div className="flex flex-col divide-y divide-outline max-h-[206px] overflow-y-auto">
            {/* SOL */}
            <div className="px-3.5 py-4 flex items-center gap-x-2.5 transition hover:bg-background-tertiary">
              <div className="w-7 h-7 rounded-full bg-background-contrast"></div>
              <div className="flex flex-col">
                <div className="text-body text-content-primary">SOL</div>
                <div className="text-caption text-content-contrast">solana</div>
              </div>
              <div className="text-caption text-content-secondary ml-auto">
                0.5 SOL
              </div>
            </div>
            {/* SOL */}
            <div className="px-3.5 py-4 flex items-center gap-x-2.5 transition hover:bg-background-tertiary">
              <div className="w-7 h-7 rounded-full bg-background-contrast"></div>
              <div className="flex flex-col">
                <div className="text-body text-content-primary">SOL</div>
                <div className="text-caption text-content-contrast">solana</div>
              </div>
              <div className="text-caption text-content-secondary ml-auto">
                0.5 SOL
              </div>
            </div>
            {/* SOL */}
            <div className="px-3.5 py-4 flex items-center gap-x-2.5 transition hover:bg-background-tertiary">
              <div className="w-7 h-7 rounded-full bg-background-contrast"></div>
              <div className="flex flex-col">
                <div className="text-body text-content-primary">SOL</div>
                <div className="text-caption text-content-contrast">solana</div>
              </div>
              <div className="text-caption text-content-secondary ml-auto">
                0.5 SOL
              </div>
            </div>
            {/* SOL */}
            <div className="px-3.5 py-4 flex items-center gap-x-2.5 transition hover:bg-background-tertiary rounded-b-lg">
              <div className="w-7 h-7 rounded-full bg-background-contrast"></div>
              <div className="flex flex-col">
                <div className="text-body text-content-primary">SOL</div>
                <div className="text-caption text-content-contrast">solana</div>
              </div>
              <div className="text-caption text-content-secondary ml-auto">
                0.5 SOL
              </div>
            </div>
          </div>
        </div>
      </CollapseDropdown>
    </>
  )
}
