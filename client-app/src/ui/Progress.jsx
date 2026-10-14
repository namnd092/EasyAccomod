import React from 'react';

export function LinearProgress() {
    return (
        <div role="progressbar" aria-label="Đang tải" className="relative h-1 w-full overflow-hidden bg-blue-200">
            <div className="animate-indeterminate absolute top-0 h-full w-2/5 bg-blue-600"></div>
        </div>
    );
}

export function Spinner({ className = 'h-10 w-10' }) {
    return (
        <span
            role="progressbar"
            aria-label="Đang tải"
            className={`inline-block animate-spin rounded-full border-4 border-current border-t-transparent ${className}`}
        ></span>
    );
}

// Dims the page and shows a spinner while `open`.
export function Backdrop({ open }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-white">
            <Spinner />
        </div>
    );
}
