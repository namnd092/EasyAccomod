import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RegisterForm from './RegisterForm';
import { renterRegisterInitialValue } from '../../models/InitialValueForm/register';
import { renterRegisterValidationSchema } from '../../models/ValidateForm/register';
import { renderWithProviders } from '../../test/renderWithProviders';

const fields = [
    { name: 'username', label: 'Tên đăng nhập' },
    { name: 'password', label: 'Mật khẩu', type: 'password' },
    { name: 'confirmPassword', label: 'Nhập lại mật khẩu', type: 'password' },
    { name: 'name', label: 'Tên' },
    { name: 'email', label: 'Email', type: 'email' },
];

function setup() {
    const onSubmit = vi.fn();
    renderWithProviders(
        <RegisterForm
            fields={fields}
            defaultValues={renterRegisterInitialValue}
            schema={renterRegisterValidationSchema}
            onSubmit={onSubmit}
        />
    );
    return { onSubmit, user: userEvent.setup() };
}

describe('RegisterForm', () => {
    it('shows the required message for every empty field and does not submit', async () => {
        const { onSubmit, user } = setup();
        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));
        expect(await screen.findAllByText('Bạn không được bỏ trống trường này !')).toHaveLength(5);
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('flags a confirmation that differs from the password', async () => {
        const { user } = setup();
        await user.type(screen.getByLabelText('Mật khẩu'), 'Abcdef1.');
        await user.type(screen.getByLabelText('Nhập lại mật khẩu'), 'Different1.');
        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));
        expect(await screen.findByText('Mật khẩu nhập lại chưa đúng')).toBeInTheDocument();
    });

    it('submits the typed values once the form is valid', async () => {
        const { onSubmit, user } = setup();
        await user.type(screen.getByLabelText('Tên đăng nhập'), 'renter9');
        await user.type(screen.getByLabelText('Mật khẩu'), 'Abcdef1.');
        await user.type(screen.getByLabelText('Nhập lại mật khẩu'), 'Abcdef1.');
        await user.type(screen.getByLabelText('Tên'), 'Tran Van B');
        await user.type(screen.getByLabelText('Email'), 'b@example.com');
        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0][0]).toEqual({
            username: 'renter9',
            password: 'Abcdef1.',
            confirmPassword: 'Abcdef1.',
            name: 'Tran Van B',
            email: 'b@example.com',
        });
    });
});
