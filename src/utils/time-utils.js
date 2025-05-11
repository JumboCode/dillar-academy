import { DateTime } from "luxon";

/**
 * Converts time from one time zone to another and returns 24-hour format.
 * @param {string} day - day of the week
 * @param {string} time24h - time in 24-hour format
 * @param {string} fromZone - original time zone in IANA format
 * @param {string} toZone - target time zone in IANA format
 * @returns {string} time in 24-hour format in target time zone.
 */
export const convertTime = (day, time24h, fromZone, toZone) => {
  const dt = DateTime.fromFormat(`${day} ${time24h}`, 'cccc H:mm', {
    zone: fromZone,
  }).setZone(toZone)

  if (!dt.isValid) {
    return { time: '', day: '' };
  }

  return {
    time: dt.toFormat('H:mm'),
    day: dt.toFormat('cccc')
  }
}

/**
 * Converts a 24-hour time string to 12-hour format with AM/PM.
 * @param {string} time24h - time in 24-hour format
 * @returns {string} time in 12-hour format
 */
export const to12HourFormat = (time24h) => {
  const dt = DateTime.fromFormat(time24h, 'H:mm');

  if (!dt.isValid) {
    return '';
  }

  return dt.toFormat('h:mm a');
}