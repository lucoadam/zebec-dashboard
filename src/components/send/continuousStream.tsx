/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "app/hooks";
import * as Icons from "assets/icons";
import { Button, CollapseDropdown, DateTimePicker, InputField, Toggle } from "components/shared";
import { useClickOutside } from "hooks";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useRef, useState } from "react";
import { toSubstring } from "utils";
import { formatCurrency } from "utils/formatCurrency";
import { getBalance } from "utils/getBalance";

const addressBook = [
  {
    name: "Alice",
    address: "22fY53fd1PYwh8ZJS2iEwH72s6P1cT8oFjcSpp5atczv",
  },
  {
    name: "Bob",
    address: "6PXSmiqxFx3HHJyjAvA6Ub9aacTQCzeqQGd6Tp9jG6wZ",
  },
  {
    name: "Charlie",
    address: "EzQ3YybP36LpYUHaDSfXtJTpzXAkHEoML6QPoJfX2NQ6",
  },
  {
    name: "Dave",
    address: "2EEHxWqc1QcURMTrtdBUKCLonvYRkrGTdG6bcKfwZf7V",
  },
]

const ContinuousStream: FC = () => {
  const { t } = useTranslation();
  const tokensDropdownWrapper = useRef(null);
  const receiverDropdownWrapper = useRef(null);

  const [tokenSearchData, setTokenSearchData] = useState("");
  const [receiverSearchData, setReceiverSearchData] = useState("");
  const [toggleTokensDropdown, setToggleTokensDropdown] =
    useState<boolean>(false);
  const [toggleReceiverDropdown, setToggleReceiverDropdown] =
    useState<boolean>(false);
  const [showRemarks, setShowRemarks] = useState<boolean>(false);
  const [enableStreamRate, setEnableStreamRate] = useState<boolean>(false);
  const [tokenAmount, setTokenAmount] = useState<string>();

  const tokenDetails =
    useAppSelector((state) => state.tokenDetails.tokens);
  const walletTokens =
    useAppSelector((state) => state.walletBalance.tokens) || [];
  const [currentToken, setCurrentToken] = useState(
    tokenDetails[0] || {
      symbol: "",
      image: "",
    }
  );
  const [receiver, setReceiver] = useState({
      name: "",
      address: "",
  });

  const handleTokensClose = () => {
    setToggleTokensDropdown(false);
  };
  const handleReceiverClose = () => {
    setToggleReceiverDropdown(false);
  };

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleTokensClose,
  });
  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose,
  });

  useEffect(()=>{
    if(tokenDetails.length>0){
      setCurrentToken(tokenDetails[0]);
    }
  }, [tokenDetails])

  return (
    <>
        <div className="bg-background-secondary rounded-[4px] p-10">
          <div className="text-heading-4 text-content-primary font-semibold">
            Continuous Stream
          </div>
          <div className="text-caption text-content-tertiary font-normal pt-2">
            Your receiver will gradually receive the money per second.
          </div>

          {/* Transaction Name and Receiver Wallet */}
          <div className="mt-12 grid lg:grid-cols-2 gap-3">
            <div>
              <InputField
                  label={"Enter Transaction Name"}
                  className="relative text-content-primary"
                  error={false}
                  labelMargin={12}
              >
                <div>
                  <input
                    className="w-full h-[40px]"
                    placeholder={"Transaction Name"}
                    type="text"
                  />
                  {!showRemarks && <Button
                    size="small"
                    title={"Add Remarks"}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    endIcon={<Icons.PlusIncircleIcon/>}
                    onClick={() => setShowRemarks(true)}
                  />}
                </div>
              </InputField>
            </div>
            <div 
              className="relative"
              ref={receiverDropdownWrapper}
            >
              <label className={`ml-3 block text-content-primary text-xs font-medium mb-1`}>
                Receiver Wallet Address
              </label>
              <div 
                className="relative rounded-lg bg-background-primary flex cursor-pointer w-full justify-between items-center h-[40px] text-content-primary"
                onClick={() => setToggleReceiverDropdown((prev) => !prev)}
              >
                <div className="flex py-2 px-5">
                  <div className={`text-subtitle ml-[5px] overflow-x-hidden ${receiver.address?'text-content-primary': 'text-content-tertiary'}`}>
                    {receiver.address? toSubstring(receiver.address, 24, false) : "Enter Wallet Address"}
                  </div>
                </div>
                <Icons.CheveronDownIcon className="absolute top-3 right-1 text-lg" />
              </div>
              <CollapseDropdown
                show={toggleReceiverDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-t-lg bg-background-primary">
                  <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                  <input
                    className="is-search w-full h-[48px] bg-background-primary"
                    placeholder="Search Wallet Address"
                    type="text"
                    onChange={(e) => setReceiverSearchData(e.target.value)}
                  />
                  <div className="divide-y divide-outline max-h-[206px] overflow-auto">
                    {addressBook
                      .filter((user) =>
                        user.name.toLowerCase().includes(receiverSearchData.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.address}
                          onClick={(event) => {
                            event.stopPropagation();
                            setToggleReceiverDropdown(false);
                            setReceiver(user);
                          }}
                          className="border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light"
                        >
                          <div className="text-caption text-content-tertiary">
                            {user.name}
                          </div>
                          <div className="text-content-primary">
                            {toSubstring(user.address, 28, false)}
                          </div>
                        </div>
                      ))}
                  </div>  
                </div>
              </CollapseDropdown>
            </div>
          </div>
          
          {/* Remarks */}
          {showRemarks && <div className="mt-4">
              <InputField
                  label={"Remarks"}
                  className="relative text-content-primary"
                  error={false}
                  labelMargin={12}
              >
                <div>
                  <input
                    className="w-full h-[40px]"
                    placeholder={"Enter the remarks here"}
                    type="text"
                  />
                  <Button
                    size="small"
                    title={"Remove Remarks"}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    endIcon={<Icons.CrossIcon/>}
                    onClick={() => setShowRemarks(false)}
                  />
                </div>
              </InputField>
          </div>}
          
          {/* Token and amount */}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <div 
              className="relative"
              ref={tokensDropdownWrapper}
            >
              <div className="flex justify-between">
                <label className="ml-3 block text-content-primary text-xs font-medium mb-1">
                  Token
                </label>
                <label className={`block text-content-tertiary text-xs font-normal mb-1`}>
                  Balance {formatCurrency(getBalance(walletTokens, currentToken.symbol))} {currentToken.symbol}
                </label>
              </div>
              <div 
                className="rounded-lg bg-background-primary flex cursor-pointer w-full justify-between items-center h-[40px] text-content-primary"
                onClick={() => setToggleTokensDropdown((prev) => !prev)}
              >
                <div className="flex py-2 px-5">
                  {currentToken.image && (
                    <img
                      className="w-[18px] h-[18px]"
                      src={currentToken.image}
                      alt={currentToken.symbol}
                    />
                  )}
                  <div className="max-w-[68px] ml-[5px] overflow-x-hidden text-content-primary">
                    {currentToken.symbol}
                  </div>
                </div>
                <Icons.CheveronDownIcon className="text-lg w-[28px]" />
              </div>
              <CollapseDropdown
                show={toggleTokensDropdown}
                className="mt-8 w-full z-[99]"
                position="left"
              >
                <div className="rounded-t-lg bg-background-primary">
                  <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
                  <input
                    className="is-search w-full h-[48px] bg-background-primary"
                    placeholder="Search token"
                    type="text"
                    onChange={(e) => setTokenSearchData(e.target.value)}
                  />
                  <div className="divide-y divide-outline max-h-[194px] overflow-auto">
                    {tokenDetails
                      .filter((token) =>
                        token.symbol.includes(tokenSearchData.toUpperCase())
                      )
                      .map((item) => (
                        <div
                          key={item.symbol}
                          onClick={(event) => {
                            event.stopPropagation();
                            setToggleTokensDropdown(false);
                            setCurrentToken(item);
                          }}
                          className="border-outline flex cursor-pointer overflow-hidden py-8 px-5 justify-start items-center hover:bg-background-light h-[40px]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="w-[18px] h-[18px] mr-[12px]  text-content-primary"
                            src={item.image}
                            alt={item.symbol}
                          />
                          <div>
                            <div className="text-content-primary ">
                              {item.symbol}
                            </div>
                            <div className="text-caption text-content-tertiary">
                              {item.name}
                            </div>
                          </div>
                          <div className="ml-auto text-caption  text-content-secondary">
                            {getBalance(walletTokens, item.symbol)} {item.symbol}
                          </div>
                        </div>
                      ))}
                  </div>  
                </div>
              </CollapseDropdown>
            </div>
            <div>
              <InputField
                    label={"Amount"}
                    className="relative text-content-primary"
                    error={false}
                    labelMargin={12}
              >
                <div>
                  <input
                    className="w-full h-[40px]"
                    placeholder={"Enter amount to send"}
                    type="number"
                    min={0}
                    value={tokenAmount}
                    disabled={enableStreamRate}
                  />
                  {!enableStreamRate && <Button
                    size="small"
                    title={"MAX"}
                    className="absolute right-[8px] top-[8px] text-content-primary"
                    onClick={()=>setTokenAmount(getBalance(walletTokens, currentToken.symbol).toString())}
                  />}
                </div>
              </InputField>
            </div>
          </div>

          {/* Stream start and Stream end */}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <div>
              <div>
                <label className="ml-3 block text-content-primary text-xs font-medium mb-1">
                  Stream Start
                </label>
                <DateTimePicker
                  placeholder="E.g. 01/01/2022"
                  startIcon={<Icons.CalenderIcon/>}  
                  endIcon= {<Icons.CheveronDownIcon/>}
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                />
              </div>
              <div className="mt-4">
                <DateTimePicker
                  placeholder="E.g. 12:00 AM"
                  startIcon={<Icons.ClockIcon/>}  
                  endIcon= {<Icons.CheveronDownIcon/>}
                  dateFormat={false}
                  timeFormat={true}
                />
              </div>             
            </div>
            <div>
              <div>
                <label className="ml-3 block text-content-primary text-xs font-medium mb-1">
                  Stream End
                </label>
                <DateTimePicker
                  placeholder="E.g. 30/01/2022"
                  startIcon={<Icons.CalenderIcon/>}  
                  endIcon= {<Icons.CheveronDownIcon/>}
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  disabled={enableStreamRate}
                />
              </div>
              <div className="mt-4">
                <DateTimePicker
                  placeholder="E.g. 12:00 AM"
                  startIcon={<Icons.ClockIcon/>}  
                  endIcon= {<Icons.CheveronDownIcon/>}
                  dateFormat={false}
                  timeFormat={true}
                  disabled={enableStreamRate}
                />
              </div>
            </div>      
          </div>

          {/* Toggle stream rate */}
          <div className="mt-4">
            <Toggle 
              text="Enable stream rate"
              onChange={()=>setEnableStreamRate(!enableStreamRate)}
            />
          </div>

          {/* Stream rate field */}
          {enableStreamRate && <div className="mt-4 grid lg:grid-cols-3 gap-3">
            <div>
              <InputField
                  label={"No. of Times"}
                  className="relative text-content-primary"
                  error={false}
                  labelMargin={12}
              >
                <div>
                  <input
                    className="w-full h-[40px]"
                    placeholder={"E.g. 4"}
                    type="number"
                    min={0}
                  />
                </div>
              </InputField>
            </div>
            <div>
              <InputField
                error={false}
                helper={""}
                label={"Token Amount"}
                placeholder={"E.g. 10"}
                type="number"
                className="w-full h-[40px]"
                labelMargin={12}
              >
                <input type="text"/>
              </InputField>
            </div>
            <div>
              <label className={`block text-content-primary text-xs font-medium mb-1`}>
                Time Interval
              </label>
              <div 
                  className="rounded-lg bg-background-primary flex cursor-pointer w-full justify-between items-center h-[40px] text-content-primary"
              >
                <div className="flex py-2 px-5">
                  Days
                </div>
                <Icons.CheveronDownIcon className="text-lg w-[28px]" />
              </div>
            </div>
          </div>}

          {/* Send button */}
          <div className="mt-12">
            <Button
              className="w-full"
              variant="gradient"
              title="Send"
              />
          </div>
      </div>
    </>
  );
};

export default ContinuousStream;
