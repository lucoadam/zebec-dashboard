import React, { FC, useState } from "react";
import { InputProps } from "./index.d";

const InputFieldCmp: FC<InputProps> = (props) => {
  const { error = false, value = "", helper = "", label = "", ...rest } = props;

  return (
    <div className="mb-4">
      <label className="block text-content-secondary text-xs ml-[12px] font-medium mb-1">
        {label}
      </label>
      <input
        className={`${error ? "error" : ""} h-[40px] appearance-none w-full`}
        type="text"
        {...rest}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          props.setValue("name", target.value);
        }}
      />
      {helper !== "" && (
        <p className="text-content-secondary text-xs ml-[12px] mt-1">
          {helper}
        </p>
      )}
    </div>
  );
};

export const InputField = InputFieldCmp;
