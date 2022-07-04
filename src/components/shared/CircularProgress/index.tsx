import React, { FC, useEffect, useState } from "react";

interface CircularProgressProps {
  percentage?: number;
  children?: React.ReactNode;
}

const getBackgroundByPercentage = (percentage: number)=> {
  if(percentage === 100){
    return 'text-success'
  }
  return 'text-primary'
}

export const CircularProgress:FC<CircularProgressProps> = ({percentage = 0, children}) => {
  const sqSize = 56;
  const strokeWidth = 5;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const [dashOffset, setDashOffset] = useState(dashArray);

  useEffect( ()  => {
    setTimeout(async () => {
      for (let i = 0; i < percentage; i++) {
        await new Promise(r => setTimeout(r, 50));
        setDashOffset(dashArray - (dashArray * i) / 100);
      }
    }, 500)
  }, []);

  return (
    <div className="relative">
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className="text-outline-dark"
        stroke="currentColor"
        fill="transparent"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />
      <circle
        className={`${getBackgroundByPercentage(percentage)} transition duration-150`}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        cx={sqSize / 2}
        cy={sqSize / 2}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        r={radius}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
        strokeWidth={`${strokeWidth}px`}
      />
    </svg>
    <span className={`absolute text-xs font-semibold text-content-primary flex justify-center items-center left-0 top-0`} style={{
      width: sqSize,
      height: sqSize
    }}>
    {children ? children : `${percentage}%`}
    </span>
    </div>
  );
};
