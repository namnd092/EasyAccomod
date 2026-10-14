// Shared Tailwind class strings for elements that stay plain HTML (inputs, tables).

export const inputClass =
    'block w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100';

export const tableClass =
    'w-full text-left [&_th]:border-t [&_th]:border-gray-200 [&_th]:p-3 [&_td]:border-t [&_td]:border-gray-200 [&_td]:p-3 [&_thead_th]:border-b-2 [&_tbody_tr:hover]:bg-black/5';

export const containerClass = 'mx-auto w-[95%] max-w-[1100px]';

// Bootstrap-style 12 column grid: `rowClass` on the parent, spans on the children.
export const rowClass = 'grid grid-cols-12 gap-x-4';

export const cardClass = 'relative rounded border border-black/10 bg-white';
export const cardHeaderClass = 'mb-0 rounded-t border-b border-black/10 bg-[pink] px-5 py-3';
export const cardBodyClass = 'p-5';
