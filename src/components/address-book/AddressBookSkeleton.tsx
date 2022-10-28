import { FC } from "react"

interface AddressBookSkeletonProps {
  count?: number
}
export const AddressBookSkeleton: FC<AddressBookSkeletonProps> = ({
  count = 2
}) => {
  return (
    <div className="w-full divide-y divide-outline shadow animate-pulse">
      {new Array(count).fill(Math.random()).map((_, index) => (
        <div key={index} className="flex items-center gap-8 py-6">
          <div className="h-4 min-w-50 skeleton-background rounded-full"></div>
          <div className="h-4 min-w-50 skeleton-background rounded-full"></div>
          <div className="h-4 w-full skeleton-background rounded-full"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
