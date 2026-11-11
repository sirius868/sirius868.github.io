const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

export function beijingTime(date = new Date()) {
  const local = new Date(date.getTime() + BEIJING_OFFSET_MS).toISOString();
  return {
    day: local.slice(0, 10),
    firstSeen: `${local.slice(0, 19)}+08:00`
  };
}
