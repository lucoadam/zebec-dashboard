import React, { FC, useState, useRef } from "react"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { useToggle } from "hooks"

const WithdrawTab: FC = () => {
  const [show, toggle, setToggle] = useToggle(false)

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        Withdraw your deposited balance into your wallet.
      </div>
      <form className="flex flex-col gap-y-6">
        <WithdrawDepositInput toggle={toggle} setToggle={setToggle}>
          {/* Tokens Dropdown */}
          <TokensDropdown show={show} />
        </WithdrawDepositInput>

        <Button
          title="Withdraw"
          variant="gradient"
          onClick={() => {}}
          className="w-full"
        />
      </form>
    </div>
  )
}

export default WithdrawTab
