function VideoCardSkeleton() {
  return (
    <div className="flex min-w-0 w-full flex-col gap-y-3 rounded-xl p-2">
      {/* Thumbnail */}
      <div className="h-55 w-full rounded-2xl bg-slate-200 animate-pulse" />
      <div className="flex gap-x-3">
        {/* Avatar */}
        <div className="h-9.5 w-9.5 shrink-0 rounded-full bg-slate-200 animate-pulse" />
        <div className="flex flex-col gap-y-2 flex-1">
          {/* Title */}
          <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
          {/* Channel name */}
          <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
          {/* Meta */}
          <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default VideoCardSkeleton;
