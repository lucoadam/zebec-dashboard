
export interface TimePickerProps {
  error?: boolean;
  placeholder?: string;
  register?: any;
  name: string;
  onChange: (value: string) => void;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  disabled?: boolean;
  reset?: () => void;
}