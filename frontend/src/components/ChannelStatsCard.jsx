import { isValidElement } from "react";
import { formatCompactNumber } from "../utils/formatCompactNumber";

function ChannelStatsCard({
  icon: Icon,
  description,
  value = 0,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse shrink-0" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="h-3.5 w-20 rounded bg-slate-200 animate-pulse" />
          <div className="h-6 w-16 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#8132e5]/10 text-[#8132e5]">
        {isValidElement(Icon) ? (
          Icon
        ) : Icon ? (
          <Icon className="text-2xl" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
          {description}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 truncate">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default ChannelStatsCard;
