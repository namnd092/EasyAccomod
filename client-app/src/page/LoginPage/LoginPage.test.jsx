import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './index';
import authApi from '../../api/authApi';
import { renderWithProviders } from '../../test/renderWithProviders';

vi.mock('../../api/authApi', () => ({ default: { postLogin: vi.fn() } }));

describe('LoginPage', () => {
    it('starts with an enabled submit button and explains what is missing when submitted empty', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);
        const submit = screen.getByRole('button', { name: 'Đăng nhập' });
        expect(submit).toBeEnabled();

        await user.click(submit);
        expect(await screen.findByText('Tên đăng nhập không được bỏ trống')).toBeInTheDocument();
        expect(screen.getByText('Mật khẩu không được bỏ trống')).toBeInTheDocument();
        expect(authApi.postLogin).not.toHaveBeenCalled();
    });

    it('rejects a weak password before calling the API', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />);
        await user.type(screen.getByLabelText('Tên đăng nhập'), 'Owner1');
        await user.type(screen.getByLabelText('Mật khẩu'), 'abcdefg');
        await user.click(screen.getByRole('button', { name: 'Đăng nhập' }));
        expect(
            await screen.findByText('Mật khẩu phải chứa ít nhất 1 ký tự in hoa và 1 ký tự đặc biệt')
        ).toBeInTheDocument();
        expect(authApi.postLogin).not.toHaveBeenCalled();
    });
});
