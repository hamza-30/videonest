function TweetCardSkeleton() {
  return (
    <div className="flex gap-3 border-b border-gray-200 px-4 py-3 sm:px-8">
      {/* Left: Avatar Skeleton */}
      <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200 animate-pulse" />

      {/* Right: Tweet Details Skeleton */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header: Author Name + Timestamp Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-28 rounded bg-slate-200 animate-pulse" />
          <div className="h-1.5 w-1.5 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
        </div>

        {/* Tweet Content Lines */}
        <div className="mt-2 space-y-1.5">
          <div className="h-3.5 w-4/5 rounded bg-slate-200 animate-pulse" />
          <div className="h-3.5 w-3/5 rounded bg-slate-200 animate-pulse" />
        </div>

        {/* Bottom Bar: Like Button Skeleton */}
        <div className="mt-2.5 flex items-center">
          <div className="h-5 w-12 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default TweetCardSkeleton;
