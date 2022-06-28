import React, { cloneElement, FC, useState } from "react";
import { InputProps } from "./index.d";

const InputFieldWrapper: FC<InputProps> = (props) => {
  const {
    error = false,
    value = "",
    helper = "",
    label = "",
    children,
    ...rest
  } = props;

  return (
    <>
      {label !== "" && (
        <label className="block text-content-primary text-xs ml-[12px] font-medium mb-1">
          {label}
        </label>
      )}
      {/* <input
        className={`${error ? "error" : ""} h-[40px] appearance-none w-full`}
        type="text"
        name={name}
        onChange={onChange}
        onInput={onChange}
        onBlur={onBlur}
      /> */}
      {cloneElement(children, {
        className: `${error ? "error " : ""}h-[40px] appearance-none w-full`,
        ...rest,
      })}
      {helper !== "" && (
        <p className="text-content-secondary text-xs ml-[12px] mt-1">
          {helper}
        </p>
      )}
    </>
  );
};

export const InputField = InputFieldWrapper;
