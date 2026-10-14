import React from 'react';
import { PRICE_RANGES, SORT_OPTIONS, priceRangeValue } from '../../searchFilters';

const chipClass = 'shrink-0 cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors';

// Above the results: price chips that narrow the search in one click, how many posts matched, and the sort order.
function ResultsToolbar({ filters, sort, totalCount, isLoading, onPriceChange, onSortChange }) {
    const activePrice = priceRangeValue(filters);
    return (
        <div className="mt-6 flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc nhanh theo giá">
                {PRICE_RANGES.slice(1).map((range) => {
                    const active = range.value === activePrice;
                    return (
                        <button
                            key={range.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onPriceChange(active ? 'all' : range.value)}
                            className={`${chipClass} ${
                                active
                                    ? 'border-purple-600 bg-purple-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {range.label}
                        </button>
                    );
                })}
            </div>
            {totalCount > 0 && (
                <div className="flex items-center justify-between gap-3">
                    <p className={`mb-0 text-gray-600 ${isLoading ? 'opacity-50' : ''}`}>{totalCount} kết quả</p>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="hidden sm:inline" aria-hidden="true">
                            Sắp xếp
                        </span>
                        <select
                            aria-label="Sắp xếp"
                            value={sort}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-gray-900"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
        </div>
    );
}

export default ResultsToolbar;
