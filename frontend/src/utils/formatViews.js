const VIEW_UNITS = [
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "k" },
];

function formatViews(views) {
  const viewCount = Number(views);

  if (!Number.isFinite(viewCount) || viewCount < 0) {
    return "0";
  }

  if (viewCount < 1000) {
    return String(Math.floor(viewCount));
  }

  const unit = VIEW_UNITS.find(({ value }) => viewCount >= value);
  const compactValue = viewCount / unit.value;
  const roundedValue = Math.round(compactValue * 10) / 10;

  return `${roundedValue}${unit.suffix}`;
}

export { formatViews };
