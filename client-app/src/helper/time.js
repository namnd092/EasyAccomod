import date from 'date-and-time';

function getDistanceTime(time) {
    const distanceTime = Date.now() - Date.parse(new Date(`${time}`));

    if (distanceTime < 60000)
        return `${Math.floor(distanceTime / 1000)} giây trước`;
    if (distanceTime < 3600000)
        return `${Math.floor(distanceTime / 60000)} phút trước`;
    if (distanceTime < 3600 * 24 * 1000)
        return `${Math.floor(distanceTime / 3600000)} giờ trước`;
    return `${Math.floor(distanceTime / (3600 * 24 * 1000))} ngày trước`;
}

function getTime(time) {
    const newTime = new Date(time);
    return date.format(newTime, 'DD-MM-YYYY');
}
export { getDistanceTime, getTime };
