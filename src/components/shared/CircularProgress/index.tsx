import * as Icons from "assets/icons"
import React, { FC, useEffect, useState } from "react"

export type TransactionStatus =
  | "completed"
  | "outgoing"
  | "scheduled"
  | "cancelled"
  | "paused"

interface CircularProgressProps {
  percentage?: number
  status: TransactionStatus
  children?: React.ReactNode
  spin?: boolean
}

const statusIconMapping = {
  completed: <Icons.CheckIcon className="text-success text-xl" />,
  scheduled: <Icons.CalenderIcon className="text-content-secondary text-xl" />,
  cancelled: <Icons.CrossIcon className="text-error text-xl" />,
  paused: <Icons.PauseIcon className="text-content-contrast text-xl" />
}

const getIconOrPercentageBasedOnStatus = (
  status: TransactionStatus,
  percentage: number
) => {
  if (status === "outgoing") return `${parseInt(percentage.toString())}%`
  return statusIconMapping[status]
}

const getBackgroundByPercentage = (
  percentage: number,
  status: TransactionStatus
) => {
  if (percentage === 100) {
    return "text-success"
  }
  switch (status) {
    case "cancelled":
      return "text-error"
    case "paused":
      return "text-content-contrast"
  }
  return "text-primary"
}

export const CircularProgress: FC<CircularProgressProps> = ({
  percentage = 0,
  status,
  spin
}) => {
  const sqSize = 56
  const strokeWidth = 5
  const radius = (sqSize - strokeWidth) / 2
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  const dashArray = radius * Math.PI * 2
  const [dashOffset, setDashOffset] = useState(dashArray)
  const [enableTransition, setEnableTransition] = useState(false)

  useEffect(() => {
    setTimeout(async () => {
      setEnableTransition(true)

      for (
        let i = status === "outgoing" ? percentage - 0.2 : 0;
        i <= percentage;
        i = i > percentage ? percentage : i + 0.2
      ) {
        await new Promise((r) => setTimeout(r, 0.1))
        setDashOffset(dashArray - (dashArray * i) / 100)
      }
      setEnableTransition(false)
    }, 0.1)
    console.log("dashArray", dashArray)
  }, [dashArray, percentage])

  return (
    <div className="relative">
      <svg
        style={{
          animation: spin ? "animation-rotate 9s linear infinite" : ""
        }}
        width={sqSize}
        height={sqSize}
        viewBox={viewBox}
      >
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
          className={`${getBackgroundByPercentage(
            percentage,
            status
          )} transition-all duration-[400ms]`}
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
            transition: enableTransition ? "1ms stroke-dashoffset" : ""
          }}
          strokeWidth={`${strokeWidth}px`}
        />
      </svg>
      <span
        className={`absolute text-xs font-semibold text-content-primary flex justify-center items-center left-0 top-0`}
        style={{
          width: sqSize,
          height: sqSize
        }}
      >
        {getIconOrPercentageBasedOnStatus(status, percentage)}
      </span>
    </div>
  )
}
