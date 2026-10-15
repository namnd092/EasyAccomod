import { describe, expect, it } from 'vitest';
import {
    DEFAULT_FILTERS,
    PRICE_RANGES,
    countActiveFilters,
    filtersFromParams,
    filtersToParams,
    pageFromParams,
    priceRangeValue,
    sortFromParams,
    withPriceRange,
} from './searchFilters';

describe('filtersFromParams', () => {
    it('falls back to the defaults for an empty query', () => {
        expect(filtersFromParams(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
    });

    it('reads numbers and text from the query', () => {
        const params = new URLSearchParams('provinceId=1&districtId=7&haveBalcony=-1&street=Cau+Giay');
        expect(filtersFromParams(params)).toEqual({
            ...DEFAULT_FILTERS,
            provinceId: 1,
            districtId: 7,
            haveBalcony: -1,
            street: 'Cau Giay',
        });
    });

    it('ignores values that are not numbers', () => {
        const params = new URLSearchParams('provinceId=abc&minPrice=-5&haveBalcony=2');
        expect(filtersFromParams(params)).toEqual(DEFAULT_FILTERS);
    });

    it('ignores keys that are not filters', () => {
        expect(filtersFromParams(new URLSearchParams('page=3&foo=bar'))).toEqual(DEFAULT_FILTERS);
    });
});

describe('filtersToParams', () => {
    it('leaves every default out so the URL stays short', () => {
        expect(filtersToParams(DEFAULT_FILTERS).toString()).toBe('');
    });

    it('writes only the filters that were changed, plus the page after the first', () => {
        const params = filtersToParams({ ...DEFAULT_FILTERS, provinceId: 1, street: 'Cau Giay' }, 2);
        expect(params.get('provinceId')).toBe('1');
        expect(params.get('street')).toBe('Cau Giay');
        expect(params.get('page')).toBe('2');
        expect(params.has('districtId')).toBe(false);
    });

    it('does not write page 1', () => {
        expect(filtersToParams(DEFAULT_FILTERS, 1).has('page')).toBe(false);
    });

    it('round-trips through filtersFromParams', () => {
        const filters = { ...DEFAULT_FILTERS, provinceId: 2, minPrice: 3, maxPrice: 5, liveWithOwner: 1 };
        expect(filtersFromParams(filtersToParams(filters))).toEqual(filters);
    });
});

describe('pageFromParams', () => {
    it('defaults to page 1', () => {
        expect(pageFromParams(new URLSearchParams())).toBe(1);
    });

    it('reads a positive whole page', () => {
        expect(pageFromParams(new URLSearchParams('page=4'))).toBe(4);
    });

    it.each(['0', '-2', '1.5', 'abc'])('treats page=%s as page 1', (page) => {
        expect(pageFromParams(new URLSearchParams({ page }))).toBe(1);
    });

    it('reads the page from another parameter when asked to', () => {
        const params = new URLSearchParams('page=2&approvedPage=5');
        expect(pageFromParams(params, 'approvedPage')).toBe(5);
        expect(pageFromParams(params, 'pendingPage')).toBe(1);
    });
});

describe('countActiveFilters', () => {
    it('is zero for the defaults', () => {
        expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0);
    });

    it('counts a price range as one filter', () => {
        expect(countActiveFilters({ ...DEFAULT_FILTERS, minPrice: 1, maxPrice: 2 })).toBe(1);
    });

    it('counts each changed field', () => {
        expect(
            countActiveFilters({ ...DEFAULT_FILTERS, provinceId: 1, street: 'x', haveBalcony: 1 })
        ).toBe(3);
    });
});

describe('priceRangeValue', () => {
    it('matches the "any price" option for the defaults', () => {
        expect(priceRangeValue(DEFAULT_FILTERS)).toBe('all');
    });

    it('finds the option for a bounded and an open-ended range', () => {
        expect(priceRangeValue({ ...DEFAULT_FILTERS, minPrice: 1, maxPrice: 2 })).toBe('1_2');
        expect(priceRangeValue({ ...DEFAULT_FILTERS, minPrice: 20, maxPrice: 0 })).toBe('20_');
    });

    it('has no option for a range typed into the URL by hand', () => {
        expect(priceRangeValue({ ...DEFAULT_FILTERS, minPrice: 4, maxPrice: 6 })).toBeNull();
    });

    it('lists the "any price" option first', () => {
        expect(PRICE_RANGES[0].value).toBe('all');
    });
});

describe('sortFromParams', () => {
    it('has no sort order by default', () => {
        expect(sortFromParams(new URLSearchParams())).toBe('');
    });

    it.each(['newest', 'priceAsc', 'priceDesc'])('reads %s', (sort) => {
        expect(sortFromParams(new URLSearchParams({ sort }))).toBe(sort);
    });

    it('ignores an order the API does not know', () => {
        expect(sortFromParams(new URLSearchParams('sort=cheapest'))).toBe('');
    });
});

describe('filtersToParams with a sort order', () => {
    it('writes the sort order next to the filters', () => {
        const params = filtersToParams({ ...DEFAULT_FILTERS, provinceId: 1 }, 2, 'priceAsc');
        expect(params.get('sort')).toBe('priceAsc');
        expect(params.get('provinceId')).toBe('1');
        expect(params.get('page')).toBe('2');
    });

    it('writes no sort for the default order', () => {
        expect(filtersToParams(DEFAULT_FILTERS, 1, '').has('sort')).toBe(false);
    });

    it('does not count the sort order as a filter', () => {
        expect(countActiveFilters(filtersFromParams(new URLSearchParams('sort=newest')))).toBe(0);
    });
});

describe('withPriceRange', () => {
    it('sets both bounds from the option and keeps the other filters', () => {
        const filters = { ...DEFAULT_FILTERS, provinceId: 1 };
        expect(withPriceRange(filters, '1_2')).toEqual({ ...filters, minPrice: 1, maxPrice: 2 });
    });

    it('clears the price for the "all" option', () => {
        expect(withPriceRange({ ...DEFAULT_FILTERS, minPrice: 1, maxPrice: 2 }, 'all')).toEqual(DEFAULT_FILTERS);
    });
});
