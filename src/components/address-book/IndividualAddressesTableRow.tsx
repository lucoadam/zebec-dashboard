import React, { FC, Fragment, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { Button, IconButton, InputField, Modal } from "components/shared";
import { toSubstring } from "utils";
import * as Icons from "assets/icons";
import * as Images from "assets/images";



interface IndividualAddresesTableRow {
  index: number;
  transaction: any;
  activeDetailsRow: "" | number;
  handleToggleRow: () => void;
}

const IndividualAddresesTableRow: FC<IndividualAddresesTableRow> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow,
}) => {
  const { t } = useTranslation("transactions");
  const detailsRowRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen)

  }

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-4 py-5 ">
            <div className=" w-36 h-14 text-subtitle font-semibold">{transaction.name}</div>
          </td>
          <td className="px-4 py-5">
            <div className=" w-36 h-14 flex flex-col text-content-contrast">
              {transaction.wallet_address}
            </div>
          </td>
          <td className="px-4 py-5">
            <div className="w-48 h-14 flex items-center gap-x-8">
              <div className="h-14"><Button
                title="Send"
                size="small"
                startIcon={
                  <Icons.ArrowUpRightIcon className="text-content-contrast" />
                }
                onClick={() => {

                }}
              /></div>
              <div className="h-14">
                <Button
                  title="Delete"
                  size="small"
                  startIcon={
                    <Icons.CrossIcon className="text-content-contrast" />
                  }
                  onClick={() => {

                  }}
                />

              </div>




            </div>
          </td>
        </tr>


      </Fragment>
    </>
  );
};

export default IndividualAddresesTableRow;
