import { EmptyDataState, Table, TableBody } from "components/shared";
import { withdrawalTransactions } from "fakedata";
import { useState } from "react";
import WithdrawalTableRow from "./WithdrawalTableRow";

export const WithdrawalTransactions = () => {
  const [activeDetailsRow, setActiveDetailsRow] = useState<"" | number>("");

  const headers = [
    {
      label: "progress",
      width: '280px',
    },
    {
      label: "confirmation",
      width: '125px',

    },
    {
      label: "withdrawn-or-initiated",
      width: '222px',

    },
    {
      label: "requested-by",
      width: '222px',

    },
    {
      label: "",
      width: '222px',

    },
  ];

  const handleToggleRow = (index: number) => {
    if (index === activeDetailsRow) setActiveDetailsRow("");
    else setActiveDetailsRow(index);
  };
  return (
    <Table headers={headers}>
      <TableBody>
      {withdrawalTransactions.data.length === 0 && (
          <tr>
            <td colSpan={headers.length}>
              <EmptyDataState message="There are no transactions. The payments you receive/ withdraw will appear here." />
            </td>
          </tr>
        )}
        {withdrawalTransactions.data.map((transaction, index) => {
          return (
            <WithdrawalTableRow
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
