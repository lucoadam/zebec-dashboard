import React, { FC } from "react";
import { TableHeader } from "./TableHeader";

interface TableProps {

  headers: TableHeader[];
  children: React.ReactNode;
}

export const Table: FC<TableProps> = ({ headers, children }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <TableHeader  headers={headers} />
          {children}
        </table>
      </div>
    </>
  );
};
