import React from 'react';

// Keeps a table that is wider than the screen scrolling on its own, instead of widening the whole page.
export function TableScroll({ children, className = '' }) {
    return <div className={`overflow-x-auto ${className}`}>{children}</div>;
}
