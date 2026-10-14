import React from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { renterRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { renterRegisterValidationSchema } from '../../../models/ValidateForm/register';
import RegisterForm from '../RegisterForm';

const fields = [
    { name: 'username', label: 'Tên đăng nhập' },
    { name: 'password', label: 'Mật khẩu', type: 'password' },
    { name: 'confirmPassword', label: 'Nhập lại mật khẩu', type: 'password' },
    { name: 'name', label: 'Tên' },
    { name: 'email', label: 'Email', type: 'email' },
];

export default function RenterRegister() {
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const response = await authApi.renterRegister(values);
            console.log(response);
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <RegisterForm
                fields={fields}
                defaultValues={renterRegisterInitialValue}
                schema={renterRegisterValidationSchema}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
