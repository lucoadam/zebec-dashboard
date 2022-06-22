import React, { FC, useEffect, useState } from "react";

interface SelectFieldProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  totalItems: number;
  onSelected: (value: number) => void;
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
    if (totalItems > 0) {
      setItems(Array.from(Array(totalItems).keys()).map((i) => i + 1));
      setSelectedPerson(Number(rest.value) ?? 1);
      rest?.onSelected(Number(rest.value) ?? 1);
    }
  }, [totalItems, rest]);

  return (
    <select
      value={selectedPerson ?? ""}
      onChange={(e) => {
        setSelectedPerson(Number(e.target.value));
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
