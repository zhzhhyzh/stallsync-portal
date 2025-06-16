import dayjs from "dayjs";

export function formatDate(date = new Date(), format = "YYYY-MM-DD") {
  return dayjs(date).format(format);
}

export function formatDateAsISO(date = new Date()) {
  return dayjs(date).toISOString();
}

export function addDays(days, date = new Date()) {
  return dayjs(date).add(days, "day");
}
