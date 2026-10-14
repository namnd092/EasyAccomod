import { useSyncExternalStore } from 'react';

const DISMISS_AFTER_MS = 5000;
const DEFAULT_ERROR = 'Đã có lỗi xảy ra, vui lòng thử lại';

let nextId = 1;
let notifications = [];
const listeners = new Set();

const publish = (next) => {
    notifications = next;
    listeners.forEach((listener) => listener());
};

export const dismiss = (id) => publish(notifications.filter((item) => item.id !== id));

export function notify(message, type = 'info') {
    const id = nextId++;
    publish([...notifications, { id, message, type }]);
    setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    return id;
}

export const notifySuccess = (message) => notify(message, 'success');

// Turns a failed request into a message for the user; the server's own messages are English.
export function errorMessage(error, fallback = DEFAULT_ERROR) {
    const status = error?.response?.status;
    if (!error?.response && error?.request) return 'Không kết nối được tới máy chủ';
    if (status === 401) return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
    if (status === 403) return 'Bạn không có quyền thực hiện thao tác này';
    if (status === 429) return 'Bạn thao tác quá nhanh, vui lòng thử lại sau';
    return fallback;
}

export const notifyError = (error, fallback) => notify(errorMessage(error, fallback), 'error');

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useNotifications = () => useSyncExternalStore(subscribe, () => notifications);
