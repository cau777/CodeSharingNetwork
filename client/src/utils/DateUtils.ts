/**
 * @summary Formats a date in the pattern month/day/year hours/minutes/seconds
 * @param str A string representing the date
 */
function formatDateTime(str: string) {
    let date = new Date(str);
    return date.toLocaleString("en-us");
}

/**
 * @summary created a new Date with the same values as the provided one
 * @param date The date to copy
 */
function copyDate(date: Date) {
    let newDate =  new Date();
    newDate.setUTCMilliseconds(date.getUTCMilliseconds());
    return newDate;
}

/**
 * @summary Finds the date with the minimum value
 * @param date1
 * @param date2
 */
function minDate(date1: Date, date2: Date) {
    return date1 < date2 ? date1 : date2;
}

/**
 * @summary Subtracts a specific number of days from a date
 * @param date The date to modify
 * @param days The number of days to subtract
 */
function subtractDays(date: Date, days: number) {
    date.setUTCHours(date.getUTCHours() - days * 24);
}

export {formatDateTime, copyDate, minDate, subtractDays};