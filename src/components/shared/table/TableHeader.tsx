import React, { FC } from "react";
import { useTranslation } from "next-i18next";

interface TableHeaderProps {
  headers: string[];
}

export const TableHeader: FC<TableHeaderProps> = (props) => {
  const { t } = useTranslation("transactions");

  const { headers } = props;

  return (
    <>
      <thead className="w-full">
        <tr className="px-6 flex items-center">
          {headers.map((header, index) => {
            return (
              <td
                key={header}
                className={`px-6 py-4 text-caption text-content-contrast font-semibold uppercase  w-full ${
                  index === 0 ? "min-w-[340px]" : "min-w-[244px] "
                }`}
              >
                {index !== headers.length - 1 && t(`table.${header}`)}
              </td>
            );
          })}
        </tr>
      </thead>
    </>
  );
};
