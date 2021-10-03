function formatDateTime(str: string) {
    let date = new Date(str);
    return date.toLocaleString("en-us");
}

export {formatDateTime};