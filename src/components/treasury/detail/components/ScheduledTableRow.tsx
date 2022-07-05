import React, { FC, Fragment, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { Button, CircularProgress, IconButton } from "components/shared";
import { toSubstring } from "utils";
import * as Icons from "assets/icons";
import * as Images from "assets/images";

interface ScheduledTableRowProps {
  index: number;
  transaction: any;
  activeDetailsRow: "" | number;
  handleToggleRow: () => void;
}

const ScheduledTableRow: FC<ScheduledTableRowProps> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow,
}) => {
  const { t } = useTranslation("transactions");
  const detailsRowRef = useRef<HTMLDivElement>(null);

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px",
    },
  };

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 w-[340px]">
            <div className="flex items-center gap-x-2.5">
              <CircularProgress  percentage={0} status="scheduled"/>
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    +48,556.98
                  </span>
                  &nbsp;SOL
                </div>
                <div className="text-caption">48,556.98 of 1,00,00,000 SOL</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 w-[200px]">
            <div className="text-caption text-content-primary">
              Mar 18, 2022, 12:00 PM <br />
              to Mar 19, 2022, 11:58 AM
            </div>
          </td>
          <td className="w-[134px] px-6 py-4">
            <div className="text-caption text-content-primary">
              10 min ago
            </div>
          </td>
          <td className="px-6 py-4 w-[200px]">
            <div className="flex items-center gap-x-2 text-body text-content-primary">
              1AdXF3...DuV15{" "}
              <IconButton
                icon={<Icons.UserAddIcon />}
                className="bg-background-primary"
              />
            </div>
          </td>
          <td className="px-6 py-4 w-[200px]">
            <div className="flex items-center float-right gap-x-6">
              <Button
                title="Cancel"
                size="small"
                startIcon={
                  <Icons.CrossIcon className="text-content-contrast" />
                }
              />
              <IconButton
                variant="plain"
                icon={<Icons.CheveronDownIcon />}
                onClick={handleToggleRow}
              />
            </div>
          </td>
        </tr>
        {/* Table Body Details Row */}
        <tr>
          <td colSpan={4}>
            <div
              ref={detailsRowRef}
              className={`bg-background-light rounded-lg overflow-hidden transition-all duration-[400ms] ${
                activeDetailsRow === index ? `ease-in` : "ease-out"
              }`}
              style={styles.detailsRow}
            >
              <div className="pt-4 pr-12 pb-6 pl-6">
                <div className="flex flex-col gap-y-2 pb-6 border-b border-outline">
                  <div className=" text-subtitle-sm font-medium text-content-primary">
                    Feb Salary
                  </div>
                  <div className="text-body text-content-secondary">
                    This is the secondary notes with character limit.
                  </div>
                </div>
                <div className="flex gap-x-44 pt-6 text-subtitle-sm font-medium">
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Sender */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.sender")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Image
                          layout="fixed"
                          alt="Sender Logo"
                          src={Images.Avatar1}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div className="">
                          {toSubstring("0x4f10x4f1U700eU700e", 5, true)}
                        </div>
                        <IconButton icon={<Icons.CopyIcon />} />
                      </div>
                    </div>
                    {/* Receiver */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.receiver")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Image
                          layout="fixed"
                          alt="Sender Logo"
                          src={Images.Avatar3}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div className="">
                          {toSubstring("0x4f10x4f1U700eU700e", 5, true)}
                        </div>
                        <IconButton icon={<Icons.CopyIcon />} />
                      </div>
                    </div>
                    {/* Start Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.start-date")}
                      </div>
                      <div className="text-content-primary">
                        Feb 19, 2022, 09:13 PM
                      </div>
                    </div>
                    {/* End Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.end-date")}
                      </div>
                      <div className="text-content-primary">
                        Feb 29, 2022, 09:13 PM
                      </div>
                    </div>
                    {/* Stream Type */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.stream-type")}
                      </div>
                      <div className="flex items-center gap-x-1 text-content-primary">
                        <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
                        <span>Continuous</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Total Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.total-amount")}
                      </div>
                      <div className="text-content-primary">20,000 SOL</div>
                    </div>
                    {/* Amount Received */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.amount-received")}
                      </div>
                      <div className="text-content-primary">
                        10,000 SOL (50%)
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.status")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Icons.OutsideLinkIcon className="w-5 h-5" />
                        <span>Ongoing</span>
                      </div>
                    </div>
                    {/* Transaction */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.transaction")}
                      </div>
                      <div className="text-content-primary">
                        <Button
                          title={`${t("table.view-on-explorer")}`}
                          size="small"
                          endIcon={
                            <Icons.OutsideLinkIcon className="text-content-contrast" />
                          }
                        />
                      </div>
                    </div>
                    {/* Reference */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.reference")}
                      </div>
                      <div className="text-content-primary">
                        <Button
                          title={`${t("table.view-reference-file")}`}
                          size="small"
                          endIcon={
                            <Icons.OutsideLinkIcon className="text-content-contrast" />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  );
};

export default ScheduledTableRow;
