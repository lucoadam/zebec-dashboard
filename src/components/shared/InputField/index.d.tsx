import React from "react";
import { UseFormSetValue } from "react-hook-form";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error: boolean;
    helper?: string;
    value?: string;
    label?: string;
    setValue: UseFormSetValue<{
        name: string;
    }>
}