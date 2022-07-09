import { useState } from "react";

export const useToggle = (
  initialValue = false,
): [boolean, () => void, (arg0: boolean) => void] => {
  const [show, setShow] = useState<boolean>(initialValue);

  const toggle = () => setShow((prev) => !prev);
  const setToggle = (value: boolean) => setShow(Boolean(value));

  return [show, toggle, setToggle];
};
