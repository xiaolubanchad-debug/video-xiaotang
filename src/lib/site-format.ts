export function formatDurationLabel(durationSeconds?: number | null) {
  if (!durationSeconds) {
    return null;
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.round((durationSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }

  return `${minutes}分钟`;
}

export function formatCompactDuration(durationSeconds?: number | null) {
  if (!durationSeconds) {
    return null;
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.round((durationSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}时${minutes}分`;
  }

  return `${minutes}分`;
}

export function formatVideoTypeLabel(type?: string | null) {
  if (!type) {
    return "影片";
  }

  const normalized = type.trim().toLowerCase();
  const labels: Record<string, string> = {
    anime: "动画",
    documentary: "纪录片",
    film: "电影",
    movie: "电影",
    series: "剧集",
    short: "短片",
    tv: "剧集",
    variety: "综艺",
  };

  return labels[normalized] ?? type;
}

export function formatVideoFormatLabel(format?: string | null) {
  if (!format) {
    return null;
  }

  const normalized = format.trim().toLowerCase();

  if (normalized === "m3u8") {
    return "M3U8";
  }

  if (normalized === "mp4") {
    return "MP4";
  }

  if (normalized === "webm") {
    return "WEBM";
  }

  return format.toUpperCase();
}
