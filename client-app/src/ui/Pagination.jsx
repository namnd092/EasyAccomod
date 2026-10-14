import React from 'react';

// Pages to show: first, last, the current page and its neighbours, with "…" for the gaps.
export function pageItems(page, count) {
    const wanted = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
    const sorted = [...wanted].sort((a, b) => a - b);
    const items = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) items.push('gap-' + p);
        items.push(p);
    });
    return items;
}

const base = 'flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm';

export function Pagination({ count, page, onChange, className = '' }) {
    if (!count || count < 1) return null;
    const go = (p) => onChange && p >= 1 && p <= count && p !== page && onChange(p);
    const nav = (label, icon, target) => (
        <button
            type="button"
            aria-label={label}
            disabled={target < 1 || target > count || target === page}
            onClick={() => go(target)}
            className={`${base} cursor-pointer hover:bg-black/10 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent`}
        >
            <i className={`fas ${icon}`} aria-hidden="true"></i>
        </button>
    );
    return (
        <nav aria-label="Phân trang" className={`flex items-center gap-1 ${className}`}>
            {nav('Trang đầu', 'fa-angle-double-left', 1)}
            {nav('Trang trước', 'fa-angle-left', page - 1)}
            {pageItems(page, count).map((item) =>
                typeof item === 'string' ? (
                    <span key={item} className={base}>
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-current={item === page ? 'page' : undefined}
                        onClick={() => go(item)}
                        className={`${base} cursor-pointer ${item === page ? 'bg-black/15 font-medium' : 'hover:bg-black/10'}`}
                    >
                        {item}
                    </button>
                )
            )}
            {nav('Trang sau', 'fa-angle-right', page + 1)}
            {nav('Trang cuối', 'fa-angle-double-right', count)}
        </nav>
    );
}
