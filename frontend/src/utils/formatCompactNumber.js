const NUMBER_UNITS = [
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "k" },
];

function formatCompactNumber(value) {
  const count = Number(value);

  if (!Number.isFinite(count) || count < 0) {
    return "0";
  }

  if (count < 1000) {
    return String(Math.floor(count));
  }

  const unit = NUMBER_UNITS.find(({ value: unitValue }) => count >= unitValue);
  const compactValue = count / unit.value;
  const roundedValue = Math.round(compactValue * 10) / 10;

  return `${roundedValue}${unit.suffix}`;
}

export { formatCompactNumber, formatCompactNumber as formatViews };
