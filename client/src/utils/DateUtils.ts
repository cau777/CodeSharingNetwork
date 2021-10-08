function formatDateTime(str: string) {
    let date = new Date(str);
    return date.toLocaleString("en-us");
}

function copyDate(date: Date) {
    let newDate =  new Date();
    newDate.setUTCMilliseconds(date.getUTCMilliseconds());
    return newDate;
}

function minDate(date1: Date, date2: Date) {
    return date1 < date2 ? date1 : date2;
}

function subtractDays(date: Date, days: number) {
    date.setUTCHours(date.getUTCHours() - days * 24);
}

export {formatDateTime, copyDate, minDate, subtractDays};