import { FC, useEffect, useState } from "react";

interface SelectFieldProps {
  value: number;
  totalItems: number;
  onSelected?: (value: number, error?: boolean) => void;
  className?: string;
}

const SelectField: FC<SelectFieldProps> = ({
  totalItems,
  value,
  onSelected,
  ...rest
}: SelectFieldProps) => {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(
    totalItems > 0 ? Number(value) ?? null : 0
  );
  const [items, setItems] = useState<number[]>([0]);

  useEffect(() => {
    if(totalItems > 0){
      setItems(Array.from(Array(totalItems).keys()).map((i) => i + 1));
    }else{
      setItems([0])
    }
  }, [totalItems]);

  return (
    <select
      value={selectedPerson ?? ""}
      onChange={(e) => {
        if (Number(e.target.value) > 1) {
          setSelectedPerson(Number(e.target.value));
          if (onSelected) {
            onSelected(Number(e.target.value) ?? 0);
          }
        }
        else if (onSelected) {
          onSelected(Number(e.target.value) ?? 0, true);
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
