import { memo } from "react";

function CommentSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
      {/* Avatar Skeleton */}
      <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Username & Time */}
        <div className="flex items-baseline gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded-md" />
          <div className="h-3 w-16 bg-gray-200 rounded-md" />
        </div>

        {/* Comment Text */}
        <div className="flex flex-col gap-1.5 mt-2.5">
          <div className="h-3.5 w-full bg-gray-200 rounded-md" />
          <div className="h-3.5 w-4/5 bg-gray-200 rounded-md" />
        </div>

        {/* Action Bottom Row (Likes) */}
        <div className="flex items-center gap-4 mt-3">
          <div className="h-4 w-12 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default memo(CommentSkeleton);
