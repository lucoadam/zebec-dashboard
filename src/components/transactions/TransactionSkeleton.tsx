import { SkeletonCircle, SkeletonCircleLight } from "assets/icons"
import { useCurrentTheme } from "hooks"
import { FC } from "react"

interface TransactionSkeletonProps {
  count?: number
}
export const TransactionSkeleton: FC<TransactionSkeletonProps> = ({
  count = 2
}) => {
  const { currentTheme } = useCurrentTheme()
  return (
    <div className="px-6 space-y-4 w-full divide-y divide-outline dark:shadow animate-pulse pb-6">
      {new Array(count).fill(Math.random()).map((_, index) => (
        <div key={index} className="flex items-center gap-8">
          <div className="flex items-center mt-4 space-x-3">
            {currentTheme === "dark" ? (
              <SkeletonCircle className="w-14 h-14" />
            ) : (
              <SkeletonCircleLight className="w-14 h-14" />
            )}

            <div>
              <div className="h-5 skeleton-background rounded-full w-[126px] mb-2"></div>
              <div className="h-4 w-[226px] skeleton-background rounded-full"></div>
            </div>
          </div>
          <div className="h-4 w-[196px] skeleton-background rounded-full"></div>
          <div className="h-4 w-[196px] skeleton-background rounded-full"></div>
          <div className="ml-auto flex gap-8">
            <div className="h-4 w-[226px] skeleton-background rounded-full"></div>
            <div className="w-5 h-5 ml-auto skeleton-background rounded-lg"></div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
