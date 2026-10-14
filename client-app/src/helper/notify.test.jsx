import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { errorMessage, notifyError, notifySuccess } from './notify';
import { Toaster } from '../ui';

const failure = (status) => ({ response: { status } });

describe('errorMessage', () => {
    it('explains the cases the user can act on', () => {
        expect(errorMessage({ request: {} })).toBe('Không kết nối được tới máy chủ');
        expect(errorMessage(failure(403))).toBe('Bạn không có quyền thực hiện thao tác này');
        expect(errorMessage(failure(429))).toBe('Bạn thao tác quá nhanh, vui lòng thử lại sau');
    });

    it('falls back to the given text, or a generic one', () => {
        expect(errorMessage(failure(500), 'Không thể lưu')).toBe('Không thể lưu');
        expect(errorMessage(failure(500))).toBe('Đã có lỗi xảy ra, vui lòng thử lại');
    });
});

describe('Toaster', () => {
    it('shows errors as alerts and successes as status messages, and can dismiss them', async () => {
        render(<Toaster />);
        act(() => {
            notifyError(failure(500), 'Không thể lưu');
            notifySuccess('Đã lưu');
        });
        expect(screen.getByRole('alert')).toHaveTextContent('Không thể lưu');
        expect(screen.getByRole('status')).toHaveTextContent('Đã lưu');

        act(() => screen.getAllByRole('button', { name: 'Đóng thông báo' }).forEach((b) => b.click()));
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
