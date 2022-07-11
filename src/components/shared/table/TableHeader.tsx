import { useTranslation } from "next-i18next";
import { FC } from "react";

export interface TableHeader {
  label: string;
  width?: string;
}

interface TableHeaderProps {
  headers: TableHeader[];
}

const getWidth = (width: string | undefined) => {
  if (width) {
    return `min-w-${width}`;
  }
  return `w-full`;
};

export const TableHeader: FC<TableHeaderProps> = (props) => {
  const { t } = useTranslation("transactions");

  const {  headers } = props;

 

  return (
    <>
      <thead className="w-full">
        <tr className="px-6 flex items-center">
          {headers.map((header, index) => {
            return (
              <td
                key={header.label}
                className={`px-6 py-4 text-caption text-content-contrast font-semibold uppercase ${getWidth(
                  header.width
                )}`}
              >
                {index !== headers.length - 1 && t(`table.${header.label}`)}
              </td>
            );
          })}
        </tr>
      </thead>
    </>
  );
};
