import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './style.css';
import authApi from '../../api/authApi';
import { startSession } from '../../redux/session';
import { useDispatch } from 'react-redux';
import { errorMessage } from '../../helper/notify';
import { Button, FormGroup, FormLabel, FieldError, Backdrop, inputClass } from '../../ui';

const initialValues = {
    username: '',
    password: '',
};

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
    password: Yup.string()
        .required('Mật khẩu không được bỏ trống')
        .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự')
        .matches(
            /\w*(?:[A-Z]+)\w*(?:[\W.]+)\w*/,
            'Mật khẩu phải chứa ít nhất 1 ký tự in hoa và 1 ký tự đặc biệt'
        ),
});

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const {
        register,
        handleSubmit: withValidation,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(validationSchema),
        mode: 'onTouched',
    });
    const handleSubmit = async ({ username, password }) => {
        setMessage('');
        try {
            setIsLoading(true);
            const { access_token } = await authApi.postLogin(username, password);
            // The session starts here; Page then loads the account info and AuthRoute leaves this page.
            dispatch(startSession(access_token));
            navigate('/');
        } catch (error) {
            if (error.response?.status === 401) setMessage('Bạn đã nhập sai tên đăng nhập hoặc mật khẩu');
            else setMessage(errorMessage(error, 'Không thể đăng nhập, vui lòng thử lại'));
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="loginPage">
            <div className="main">
                <div className="top">
                    <h4 className="title">ĐĂNG NHẬP</h4>
                </div>
                <div className="bot">
                    <form className="from" onSubmit={withValidation(handleSubmit)}>
                        {message && (
                            <span
                                style={{
                                    fontSize: 'smaller',
                                    color: 'red',
                                }}
                            >
                                {message}
                            </span>
                        )}
                        <FormGroup className="form__group">
                            <FormLabel htmlFor="username">Tên đăng nhập</FormLabel>
                            <input
                                id="username"
                                className={inputClass}
                                {...register('username')}
                            />
                            <FieldError error={errors.username} />
                        </FormGroup>
                        <FormGroup className="form__group">
                            <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                            <input
                                id="password"
                                type="password"
                                className={inputClass}
                                {...register('password')}
                            />
                            <FieldError error={errors.password} />
                        </FormGroup>
                        <div className="mt-5 flex justify-between px-5">
                            <Button
                                className="h-[50px] w-[150px]"
                                variant="secondary"
                                onClick={() => navigate('/register')}
                            >
                                Đăng ký
                            </Button>
                            <Button
                                className="h-[50px] w-[150px]"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Đăng nhập
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Backdrop open={isLoading} />
        </div>
    );
}

export default LoginPage;
