import moment from 'moment';
import { FC } from 'react';
import Datetime from 'react-datetime';

interface DateTimePickerProps {
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  placeholder?: string;
  dateFormat?: string | boolean;
  timeFormat?: string | boolean;
  onChange?: (value: string | moment.Moment) => void;
  disabled?: boolean;
}
export const DateTimePicker:FC<DateTimePickerProps> = ( props )=>{
  return (
    <div className="relative">
      <div className="absolute text-content-primary z-50 top-3 left-5">
        {props.startIcon}
      </div>
      <Datetime className="text-content-primary" 
        timeFormat={props.timeFormat}
        inputProps={{
          disabled: props.disabled,
          placeholder: props.placeholder,
          className: "w-full h-[40px] bg-background-primary date-picker-input"
        }}
        dateFormat={props.dateFormat}
        closeOnSelect={true}
        closeOnClickOutside={true}
        onChange={props.onChange}
      />
      <div className="text-lg absolute text-content-primary z-2 top-3 right-1">
        {props.endIcon}
      </div>
    </div>
  );
}