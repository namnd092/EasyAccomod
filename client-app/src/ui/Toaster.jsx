import React from 'react';
import { dismiss, useNotifications } from '../helper/notify';

const tone = {
    info: 'bg-gray-800 text-white',
    success: 'bg-green-700 text-white',
    error: 'bg-red-700 text-white',
};

// Mounted once near the root; shows what `notify`, `notifySuccess` and `notifyError` publish.
export function Toaster() {
    const notifications = useNotifications();
    return (
        <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
            {notifications.map(({ id, message, type }) => (
                <div
                    key={id}
                    role={type === 'error' ? 'alert' : 'status'}
                    className={`pointer-events-auto flex items-start justify-between gap-3 rounded px-4 py-3 text-sm shadow-lg ${tone[type] || tone.info}`}
                >
                    <span>{message}</span>
                    <button type="button" aria-label="Đóng thông báo" className="cursor-pointer text-lg leading-none" onClick={() => dismiss(id)}>
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}
