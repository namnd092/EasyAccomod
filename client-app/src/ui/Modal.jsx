import React from 'react';

export function Modal({ open, onClose, title, footer, children }) {
    const titleId = React.useId();

    React.useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (event) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-2xl rounded bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                    <h5 id={titleId} className="mb-0">
                        {title}
                    </h5>
                    <button type="button" aria-label="Đóng" onClick={onClose} className="cursor-pointer text-2xl leading-none text-gray-500 hover:text-gray-800">
                        &times;
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
                {footer && <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">{footer}</div>}
            </div>
        </div>
    );
}
