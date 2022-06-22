import { Listbox } from "@headlessui/react";
import { CheveronDownIcon } from "assets/icons";
import React, { FC, ReactElement, useEffect, useState } from "react";


interface SelectFieldProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  totalItems: number;
}

const SelectField: FC<SelectFieldProps> = ({
  totalItems,
  ...rest
}: SelectFieldProps) => {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(
    Number(rest.value) ?? null
  );
  const [items, setItems] = useState<number[]>([]);
  const [selectRef, setSelectRef] = useState<HTMLSelectElement | null>();

  useEffect(() => {
    if (totalItems > 0) {
      setItems(Array.from(Array(totalItems).keys()).map((i) => i + 1));
      setSelectedPerson(Number(rest.value) ?? 1);
    }
  }, [totalItems, rest.value]);

  return (
      <select
        ref={(ref) => {
          setSelectRef(ref);
        }}
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
