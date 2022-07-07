import { Table, TableBody } from "components/shared";
import { scheduledTransactions } from "fakedata";
import { useState } from "react";
import ScheduledTableRow from "./ScheduledTableRow";

export const ScheduledTransactions = () => {
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("");

  const headers = [
    {
      label: "progress",
      width: '340px',
    },
    {
      label: "transaction-date",
      width: '200px',

    },
    {
      label: "initiated",
      width: '134px',
        
    },
    {
      label: "receiver",
      width: '200px',

    },
    {
      label: "",
      width: '200px',

    },
  ];

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("");
    else setActiveDetailsRow(index);
  };
  return (
    <Table headers={headers}>
      <TableBody>
        {scheduledTransactions.data.map((transaction, index) => {
          return (
            <ScheduledTableRow
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
  );
};
