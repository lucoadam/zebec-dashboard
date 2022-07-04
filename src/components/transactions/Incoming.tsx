import React, { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import FilterTabs from "./FilterTabs";
import { Table, TableBody } from "components/shared";
import IncomingTableRow from "./IncomingTableRow";
import { Pagination } from "components/shared/Pagination";

import { incomingTransactions } from "fakedata";

const Incoming: FC = () => {
  const { t } = useTranslation("transactions");

  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("");
  const [currentPage,setCurrentPage]=useState(1)
  const [NoOfRows,setNoOfRows] =useState(10)


  const headers = ["progress", "transaction-date", "sender", ""];

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("");
    else setActiveDetailsRow(index);
  };

  return (
    <>
      <h4 className="px-3.5 pb-6 text-heading-4 font-semibold text-content-primary">
        {t("incoming-transactions")}
      </h4>
      {/* Tabs */}
      <FilterTabs />
      {/* Table */}
      <Table headers={headers}>
        <TableBody>
          {incomingTransactions.data.map((transaction, index) => {
            return (
              <IncomingTableRow
                key={index}
                index={index}
                transaction={transaction}
                activeDetailsRow={activeDetailsRow}
                handleToggleRow={() => handleToggleRow(index)}
              />
            );
          })}
        </TableBody>
      </Table>
      <Pagination pages={100} setCurrentPage={setCurrentPage} setNoOfRows={setNoOfRows}/>
    </>
  );
};

export default Incoming;
