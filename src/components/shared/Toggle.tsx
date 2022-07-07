import { FC } from "react";

interface ToggleProps {
  text: string;
  onChange: () => void;
}

export const Toggle: FC<ToggleProps> = (props) => {
  const { text } = props;
  return (
    <>
      <div>
        <label htmlFor="toggle" className="w-max flex items-center cursor-pointer relative">
          <input type="checkbox" id="toggle" className="sr-only" onChange={props.onChange}/>
          <div className="toggle-bg bg-background-primary border-2 border-outline h-[18px] w-9 rounded-full"></div>
          <span className="ml-[10px] text-sm font-medium text-content-primary">{text}</span>
        </label>
      </div>
    </>
  );
};