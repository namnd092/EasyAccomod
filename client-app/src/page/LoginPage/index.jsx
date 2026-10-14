import React, { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './style.css';
import authApi from '../../api/authApi';
import { setUser } from '../../redux/slice/userSlice';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';
import { Button, FormGroup, FormLabel, FieldError, Spinner, Backdrop, inputClass } from '../../ui';

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

LoginPage.propTypes = {
    handle: PropTypes.func,
};
function LoginPage(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('');
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
    const handleSubmit = async (value) => {
        console.log('Submit Login', value);
        const { username, password } = value;
        try {
            setIsLoading(true);
            const loginResponse = await authApi.postLogin(username, password);
            const { access_token } = await loginResponse;
            localStorage.setItem('token', access_token);
            console.log(localStorage.getItem('token'));
            Axios.get(`${import.meta.env.VITE_API_URL}/` + ApiUrl.GET_ACCOUNT_INFO, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            })
                .then(async (response) => {
                    const infoResponse = await response.data;
                    await dispatch(setUser({ ...infoResponse }));
                    setMessage('Bạn đã đăng nhập thành công');
                    navigate('/');
                })
                .catch((error) => console.log(error));
            // const infoResponse = await authApi.getAccountInfoByToken();
            // console.log(infoResponse);
        } catch (error) {
            console.log(error);
            setMessage('Bạn đã nhập sai tên đăng nhập hoặc mật khẩu');
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
            {isLoading && (
                <Backdrop
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
                    open
                    onClick={() => setIsLoading(false)}
                >
                    <Spinner color="inherit" />
                </Backdrop>
            )}
        </div>
    );
}

export default LoginPage;
