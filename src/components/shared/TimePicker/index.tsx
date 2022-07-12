/* eslint-disable react-hooks/exhaustive-deps */
import { CollapseDropdown } from "components/shared";
import { useClickOutside } from "hooks";
import { FC, useEffect, useRef, useState } from "react";
import { TimePickerProps } from "./index.d";

const Hours = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const Minutes = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
];
const ap = ["AM", "PM"];

export const TimePicker: FC<TimePickerProps> = ({
  error,
  register,
  placeholder,
  name,
  onChange,
  startIcon,
  endIcon,
  disabled,
}) => {
  const dropdownWrapper = useRef(null);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [selectedMinute, setSelectedMinute] = useState<string>("");
  const [selectedAP, setSelectedAP] = useState<string>("");

  useClickOutside(dropdownWrapper, {
    onClickOutside: () => {
      setToggleDropdown(false);
    },
  });
  const handleClick = () => {
    if(!disabled){
      setToggleDropdown(!toggleDropdown);
    }
  };
  useEffect(() => {
    if (selectedHour && selectedMinute && selectedAP) {
      onChange(`${selectedHour}:${selectedMinute} ${selectedAP}`);
    }
  }, [selectedHour, selectedMinute, selectedAP]);

  return (
    <div>
      <div className="relative" ref={dropdownWrapper}>
        <div className="relative text-content-primary" onClick={handleClick}>
          <div className="absolute text-content-primary z-50 top-3 left-5">
            {startIcon}
          </div>
          <input
            type="text"
            readOnly
            placeholder={placeholder}
            className={`w-full h-[40px] date-picker-input ${error && "error"}`}
            disabled={disabled}
            {...(register ? register(name) : null)}
          />
          <div className="text-lg absolute text-content-primary z-2 top-3 right-1">
            {endIcon}
          </div>
        </div>
        <CollapseDropdown
          show={toggleDropdown}
          className="w-[200px] z-[99]"
          position="left"
        >
          <div className="grid grid-cols-3 rounded-t-lg bg-background-primary border border-outline">
            <div className="max-h-[184px] overflow-auto no-scrollbar">
              {Hours.map((hour) => (
                <div
                  className={`flex items-center justify-center p-2 cursor-pointer ${
                    hour === selectedHour
                      ? "bg-background-light hover:bg-background-light"
                      : "hover:bg-background-secondary"
                  }`}
                  key={hour}
                  onClick={() => {
                    setSelectedHour(hour);
                  }}
                >
                  <span className="text-content-primary text-sm">{hour}</span>
                </div>
              ))}
            </div>
            <div className="max-h-[184px] overflow-auto no-scrollbar">
              {Minutes.map((minute) => (
                <div
                  className={`flex items-center justify-center p-2 cursor-pointer ${
                    minute === selectedMinute
                      ? "bg-background-light hover:bg-background-light"
                      : "hover:bg-background-secondary"
                  }`}
                  key={minute}
                  onClick={() => {
                    setSelectedMinute(minute);
                  }}
                >
                  <span className="text-content-primary text-sm">{minute}</span>
                </div>
              ))}
            </div>
            <div className="max-h-[184px] overflow-auto no-scrollbar">
              {ap.map((a) => (
                <div
                  className={`flex items-center justify-center p-2 cursor-pointer ${
                    a === selectedAP
                      ? "bg-background-light hover:bg-background-light"
                      : "hover:bg-background-secondary"
                  }`}
                  key={a}
                  onClick={() => {
                    setSelectedAP(a);
                  }}
                >
                  <span className="text-content-primary text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapseDropdown>
      </div>
    </div>
  );
};
