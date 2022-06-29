import React, { FC } from "react";

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: FC<TableBodyProps> = ({ children }) => {
  return (
    <>
      <tbody className="table px-6 py-5 rounded-lg bg-background-secondary w-full border-separate divide-y divide-outline">
        {children}
      </tbody>
    </>
  );
};
