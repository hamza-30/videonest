function SearchVideoCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full rounded-xl p-2 animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video w-full sm:w-80 md:w-96 shrink-0 rounded-xl bg-slate-200" />

      {/* Info Container Skeleton */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Title Skeleton */}
        <div className="h-5 sm:h-6 w-full max-w-md bg-slate-200 rounded mb-2" />
        <div className="h-5 sm:h-6 w-3/4 max-w-sm bg-slate-200 rounded mb-3" />

        {/* Views & Timestamp Skeleton */}
        <div className="h-3 sm:h-4 w-32 bg-slate-200 rounded mb-4" />

        {/* Channel Info Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-200 shrink-0" />
          <div className="h-3 sm:h-4 w-24 bg-slate-200 rounded" />
        </div>

        {/* Description Snippet Skeleton */}
        <div className="hidden sm:flex flex-col gap-1.5">
          <div className="h-3 sm:h-4 w-full max-w-xl bg-slate-200 rounded" />
          <div className="h-3 sm:h-4 w-5/6 max-w-lg bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default SearchVideoCardSkeleton;

