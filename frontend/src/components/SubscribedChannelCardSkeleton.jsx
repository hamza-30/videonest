function SubscribedChannelCardSkeleton() {
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
      {/* Left: Avatar & Details Skeleton */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 animate-pulse sm:h-14 sm:w-14" />
        {/* Details */}
        <div className="flex flex-1 flex-col gap-y-2 min-w-0">
          {/* Full Name */}
          <div className="h-4 w-3/5 rounded bg-slate-200 animate-pulse sm:h-4.5" />
          {/* Username */}
          <div className="h-3 w-2/5 rounded bg-slate-200 animate-pulse sm:h-3.5" />
          {/* Subscriber count */}
          <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Right: Button Skeleton */}
      <div className="h-8 w-20 shrink-0 rounded-lg bg-slate-200 animate-pulse sm:h-9 sm:w-24" />
    </div>
  );
}

export default SubscribedChannelCardSkeleton;
