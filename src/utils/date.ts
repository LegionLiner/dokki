import { DateTime, type DateTimeOptions, type ZoneOptions } from "luxon";

export const formatDate = (date: Date, format: string): string =>
  DateTime.fromJSDate(date).toFormat(format);

export const utcToDate = (
  date: string,
  options: DateTimeOptions = { zone: "utc" },
): Date => DateTime.fromISO(date, options).toJSDate();

export const dateToUTC = (
  date: Date,
  options: ZoneOptions = { keepLocalTime: true },
): string | null =>
  DateTime.fromJSDate(date).toUTC(DateTime.local().offset, options).toISO();

export const stringToDate = (date: string, format: string): Date =>
  DateTime.fromFormat(date, format).toJSDate();

export const convertFormat = (
  date: string,
  fromFormat: string,
  toFormat: string,
): string => DateTime.fromFormat(date, fromFormat).toFormat(toFormat);
