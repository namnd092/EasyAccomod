const pad = (value) => String(value).padStart(2, '0');

// "3 giờ trước" style distance between `time` and now (never negative).
function getDistanceTime(time, now = Date.now()) {
    const distanceTime = Math.max(0, now - new Date(time).getTime());

    if (distanceTime < 60000)
        return `${Math.floor(distanceTime / 1000)} giây trước`;
    if (distanceTime < 3600000)
        return `${Math.floor(distanceTime / 60000)} phút trước`;
    if (distanceTime < 3600 * 24 * 1000)
        return `${Math.floor(distanceTime / 3600000)} giờ trước`;
    return `${Math.floor(distanceTime / (3600 * 24 * 1000))} ngày trước`;
}

// DD-MM-YYYY in the viewer's time zone.
function getTime(time) {
    const date = new Date(time);
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export { getDistanceTime, getTime };
