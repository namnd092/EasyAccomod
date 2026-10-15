import React from 'react';

// A row of full-width tabs. `tabs` is the list of labels; `value` the index of the active one.
export function Tabs({ tabs, value, onChange, className = '' }) {
    return (
        <div role="tablist" className={`flex overflow-x-auto bg-gray-100 shadow ${className}`}>
            {tabs.map((label, index) => (
                <button
                    key={label}
                    type="button"
                    role="tab"
                    id={`full-width-tab-${index}`}
                    aria-selected={value === index}
                    aria-controls={`full-width-tabpanel-${index}`}
                    onClick={() => onChange(index)}
                    className={`flex-1 shrink-0 cursor-pointer whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium uppercase tracking-wide ${
                        value === index
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:bg-black/5'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
