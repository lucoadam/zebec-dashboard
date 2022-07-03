import React, { FC, useEffect, useState } from "react";

interface SelectFieldProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  totalItems: number;
  onSelected?: (value: number, error?: boolean) => void;
}

const SelectField: FC<SelectFieldProps> = ({
  totalItems,
  ...rest
}: SelectFieldProps) => {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(
    totalItems > 0 ? Number(rest.value) ?? null : null
  );
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    setItems(Array.from(Array(totalItems).keys()).map((i) => i + 1));
  }, [totalItems]);

  return (
    <select
      value={selectedPerson ?? ""}
      onChange={(e) => {
        if (Number(e.target.value) > 1) {
          setSelectedPerson(Number(e.target.value));
          if (rest.onSelected) {
            rest?.onSelected(Number(e.target.value) ?? 0);
          }
        }
        else if (rest.onSelected) {
          rest?.onSelected(Number(e.target.value) ?? 0, true);
        }
      }}
      {...rest}
    >
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
