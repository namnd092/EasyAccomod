import React from 'react';

// A heading that expands and collapses its content (replaces the MUI accordion).
export function Collapsible({ title, children, defaultOpen = false, className = '' }) {
    const [open, setOpen] = React.useState(defaultOpen);
    const id = React.useId();
    return (
        <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
            <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen(!open)}
                className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100"
            >
                <span className="text-lg font-medium">{title}</span>
                <i className={`fas fa-chevron-down text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true"></i>
            </button>
            <div id={id} hidden={!open} className="px-4 pb-1 pt-3">
                {children}
            </div>
        </div>
    );
}
