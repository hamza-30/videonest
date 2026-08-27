function formatDuration(duration) {
  let totalSeconds;

  if (typeof duration === "string" && duration.includes(":")) {
    const parts = duration.split(":").map(Number);

    if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
      return "00:00";
    }

    totalSeconds = parts.reduce(
      (total, part, index) => total + part * 60 ** (parts.length - index - 1),
      0
    );
  } else {
    totalSeconds = Number(duration);
  }

  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }

  totalSeconds = Math.floor(totalSeconds);

  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

export { formatDuration };
