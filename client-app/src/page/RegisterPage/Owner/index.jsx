import React from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { ownerRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { ownerRegisterValidationSchema } from '../../../models/ValidateForm/register';
import RegisterForm from '../RegisterForm';

const fields = [
    { name: 'username', label: 'Tên đăng nhập' },
    { name: 'password', label: 'Mật khẩu', type: 'password' },
    { name: 'confirmPassword', label: 'Nhập lại mật khẩu', type: 'password' },
    { name: 'name', label: 'Tên' },
    { name: 'address', label: 'Địa chỉ' },
    { name: 'email', label: 'Email' },
];
const halfFields = [
    { name: 'phone', label: 'Số điện thoại' },
    { name: 'identification', label: 'CMTND/CCCD' },
];

export default function OwnerRegister() {
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        try {
            const response = await authApi.ownerRegister(values);
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
                halfFields={halfFields}
                defaultValues={ownerRegisterInitialValue}
                schema={ownerRegisterValidationSchema}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
