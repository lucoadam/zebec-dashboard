import { FC, useEffect, useState } from "react"

interface LoadingProgressProps {
  percentage?: number
  onComplete?: () => void
}

export const LoadingProgress: FC<LoadingProgressProps> = ({ onComplete }) => {
  const radius = 10
  const circumference = 2 * Math.PI * radius
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    onComplete && onComplete()
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev < 100) {
          return prev + 10 / 60
        }
        onComplete && onComplete()
        return 0
      })
    }, 100)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      onClick={() => {
        onComplete && onComplete()
        setPercentage(0)
      }}
      className="transform -rotate-90 flex items-center justify-center cursor-pointer"
    >
      <svg className="w-6 h-6">
        <circle
          cx={12}
          cy={12}
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx={12}
          cy={12}
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          className="text-blue-500 "
        />
      </svg>
    </div>
  )
}
