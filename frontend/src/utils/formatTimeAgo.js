const TIME_UNITS = [
  { label: "year", seconds: 365 * 24 * 60 * 60 },
  { label: "month", seconds: 30 * 24 * 60 * 60 },
  { label: "week", seconds: 7 * 24 * 60 * 60 },
  { label: "day", seconds: 24 * 60 * 60 },
  { label: "hour", seconds: 60 * 60 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

function formatTimeAgo(dateValue, now = Date.now()) {
  const timestamp =
    dateValue instanceof Date
      ? dateValue.getTime()
      : new Date(dateValue).getTime();

  if (!Number.isFinite(timestamp)) {
    return "Unknown time";
  }

  const currentTime =
    now instanceof Date ? now.getTime() : new Date(now).getTime();

  if (!Number.isFinite(currentTime)) {
    return "Unknown time";
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((currentTime - timestamp) / 1000)
  );

  if (elapsedSeconds === 0) {
    return "just now";
  }

  const unit = TIME_UNITS.find(({ seconds }) => elapsedSeconds >= seconds);
  const value = Math.floor(elapsedSeconds / unit.seconds);
  const label = value === 1 ? unit.label : `${unit.label}s`;

  return `${value} ${label} ago`;
}

export { formatTimeAgo };
