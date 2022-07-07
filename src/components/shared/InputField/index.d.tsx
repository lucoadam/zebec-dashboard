import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error: boolean;
    helper?: string;
    value?: string;
    label?: string;
    children: React.ReactElement;
    labelMargin?: number;
}