export function isToday(dt: Date) {
  if (!dt) return false;
  const today = new Date();
  return (
    dt.getDate() === today.getDate() &&
    dt.getMonth() === today.getMonth() &&
    dt.getFullYear() === today.getFullYear()
  );
}

export function isSameDay(d1: Date, d2: Date) {
  if (!d1 || !d2) return false;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export function getSunday(id: Date) {
  const d = new Date(id);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  if (day !== 0) d.setHours(-24 * day);
  return d;
}

export function getSaturday(d: Date) {
  const nd = getSunday(d);
  nd.setDate(nd.getDate() + 6);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

export const dow = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
