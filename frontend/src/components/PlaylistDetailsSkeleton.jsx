function PlaylistDetailsSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      {/* Header card */}
      <div className="bg-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-4 p-3 sm:p-4">
        {/* Thumbnail */}
        <div className="aspect-video w-full sm:w-72 md:w-80 shrink-0 rounded-xl bg-gray-200" />

        {/* Info */}
        <div className="flex flex-col flex-1 gap-3 py-1 w-full">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="h-7 w-3/4 max-w-sm bg-gray-200 rounded-md" />
          </div>

          {/* Description lines */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="h-3.5 w-full max-w-lg bg-gray-200 rounded" />
            <div className="h-3.5 w-5/6 max-w-md bg-gray-200 rounded" />
            <div className="h-3.5 w-4/6 max-w-sm bg-gray-200 rounded" />
          </div>

          {/* Owner details */}
          <div className="flex items-center gap-3 mt-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Stats */}
          <div className="h-3.5 w-40 bg-gray-200 rounded mt-2" />
        </div>
      </div>

      {/* Videos List */}
      <div className="mt-6 flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-3 rounded-xl p-2"
          >
            {/* Video Thumbnail */}
            <div className="aspect-video w-full sm:w-40 md:w-48 shrink-0 rounded-xl bg-gray-200" />

            {/* Video Info */}
            <div className="flex flex-col flex-1 gap-2.5 py-1">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-2 flex-1 mt-1">
                  <div className="h-4 w-full max-w-md bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 max-w-sm bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistDetailsSkeleton;
