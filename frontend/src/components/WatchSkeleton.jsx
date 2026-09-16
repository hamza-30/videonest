import { memo } from "react";

function WatchSkeleton() {
  return (
    <div className="p-5 max-w-300 mx-auto w-full flex flex-col gap-4 animate-pulse">
      {/* Video Player Skeleton */}
      <div className="w-full aspect-video bg-gray-200 rounded-xl" />

      {/* Video Details Skeleton */}
      <div className="flex flex-col gap-4 mt-2">
        {/* Title */}
        <div className="h-7 bg-gray-200 rounded-lg w-3/4 sm:w-1/2" />
        <div className="h-7 bg-gray-200 rounded-lg w-1/2 sm:w-1/3 -mt-2" />

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 bg-gray-200 rounded-full" />
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
            <div className="ml-3 h-9 w-24 bg-gray-200 rounded-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-gray-200 rounded-full" />
            <div className="h-9 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Description Box Skeleton */}
        <div className="h-24 bg-gray-200 rounded-2xl w-full mt-2" />
      </div>
    </div>
  );
}

export default memo(WatchSkeleton);
