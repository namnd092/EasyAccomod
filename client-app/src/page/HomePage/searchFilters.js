// The search filters of the home page, and how they are kept in the URL query.

export const DEFAULT_FILTERS = {
    provinceId: 0,
    districtId: 0,
    wardId: 0,
    street: '',
    publicLocationNearby: '',
    accommodationTypeId: 0,
    paymentTypeId: 0,
    minPrice: 0,
    maxPrice: 0,
    roomAreaRangeId: 0,
    kitchenTypeId: 0,
    haveAirConditioner: 0,
    haveBalcony: 0,
    haveClosedBathroom: 0,
    haveWaterHeater: 0,
    liveWithOwner: 0,
};

// Prices are in millions; a bound of 0 means "no limit".
export const PRICE_RANGES = [
    { value: 'all', label: 'Tất cả', minPrice: 0, maxPrice: 0 },
    { value: '_1', label: 'Dưới 1 triệu', minPrice: 0, maxPrice: 1 },
    { value: '1_2', label: '1 triệu - 2 triệu', minPrice: 1, maxPrice: 2 },
    { value: '2_3', label: '2 triệu - 3 triệu', minPrice: 2, maxPrice: 3 },
    { value: '3_5', label: '3 triệu - 5 triệu', minPrice: 3, maxPrice: 5 },
    { value: '5_7', label: '5 triệu - 7 triệu', minPrice: 5, maxPrice: 7 },
    { value: '7_10', label: '7 triệu - 10 triệu', minPrice: 7, maxPrice: 10 },
    { value: '10_15', label: '10 triệu - 15 triệu', minPrice: 10, maxPrice: 15 },
    { value: '15_20', label: '15 triệu - 20 triệu', minPrice: 15, maxPrice: 20 },
    { value: '20_', label: 'Trên 20 triệu', minPrice: 20, maxPrice: 0 },
];

// Fields that take 1 (must have), -1 (must not have) or 0 (don't care).
const TRI_STATE_FIELDS = new Set([
    'haveAirConditioner',
    'haveBalcony',
    'haveClosedBathroom',
    'haveWaterHeater',
    'liveWithOwner',
]);
const TEXT_FIELDS = new Set(['street', 'publicLocationNearby']);

function parseField(key, raw) {
    if (TEXT_FIELDS.has(key)) return raw;
    const number = Number(raw);
    if (raw === '' || !Number.isInteger(number)) return DEFAULT_FILTERS[key];
    if (TRI_STATE_FIELDS.has(key)) return [-1, 0, 1].includes(number) ? number : DEFAULT_FILTERS[key];
    return number >= 0 ? number : DEFAULT_FILTERS[key];
}

export function filtersFromParams(params) {
    const filters = { ...DEFAULT_FILTERS };
    for (const key of Object.keys(DEFAULT_FILTERS)) {
        if (params.has(key)) filters[key] = parseField(key, params.get(key));
    }
    return filters;
}

export function pageFromParams(params) {
    const page = Number(params.get('page'));
    return Number.isInteger(page) && page > 0 ? page : 1;
}

// The orders the API sorts by; the first one (no value) keeps the order the posts were created in.
export const SORT_OPTIONS = [
    { value: '', label: 'Mặc định' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'priceAsc', label: 'Giá tăng dần' },
    { value: 'priceDesc', label: 'Giá giảm dần' },
];

export function sortFromParams(params) {
    const sort = params.get('sort');
    return SORT_OPTIONS.some((option) => option.value === sort) ? sort : '';
}

// Only what differs from the defaults is written, so an unfiltered search has a clean URL.
// The sort order is part of the URL but is not a filter.
export function filtersToParams(filters, page = 1, sort = '') {
    const params = new URLSearchParams();
    for (const key of Object.keys(DEFAULT_FILTERS)) {
        if (filters[key] !== DEFAULT_FILTERS[key]) params.set(key, String(filters[key]));
    }
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    return params;
}

// A price range counts as one filter, however many of its bounds are set.
export function countActiveFilters(filters) {
    const changed = Object.keys(DEFAULT_FILTERS).filter((key) => filters[key] !== DEFAULT_FILTERS[key]);
    const priceKeys = changed.filter((key) => key === 'minPrice' || key === 'maxPrice');
    return changed.length - priceKeys.length + (priceKeys.length > 0 ? 1 : 0);
}

// The select option that matches the current bounds, or null for a range only a hand-edited URL can produce.
export function priceRangeValue({ minPrice, maxPrice }) {
    const range = PRICE_RANGES.find((r) => r.minPrice === minPrice && r.maxPrice === maxPrice);
    return range ? range.value : null;
}

// The filters with the price bounds of the given PRICE_RANGES option.
export function withPriceRange(filters, rangeValue) {
    const { minPrice, maxPrice } = PRICE_RANGES.find((range) => range.value === rangeValue);
    return { ...filters, minPrice, maxPrice };
}
