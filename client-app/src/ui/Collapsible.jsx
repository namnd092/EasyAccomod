import React from 'react';

// A heading that expands and collapses its content (replaces the MUI accordion).
export function Collapsible({ title, children, className = '' }) {
    const [open, setOpen] = React.useState(false);
    const id = React.useId();
    return (
        <div className={`border-b border-gray-200 bg-gray-100 ${className}`}>
            <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen(!open)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left"
            >
                <span className="text-[2rem] font-medium leading-tight">{title}</span>
                <i className={`fas fa-chevron-down text-xl transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true"></i>
            </button>
            <div id={id} hidden={!open} className="px-4 pb-4">
                {children}
            </div>
        </div>
    );
}
