import React, { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './style.css';
import authApi from '../../api/authApi';
import { setUser } from '../../redux/slice/userSlice';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';
import { Button, FormGroup, FormLabel, Spinner, Backdrop, inputClass } from '../../ui';

LoginPage.propTypes = {
    handle: PropTypes.func,
};
function LoginPage(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
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
                    <Formik
                        validationSchema={validationSchema}
                        onSubmit={(value) => handleSubmit(value)}
                        initialValues={initialValues}
                    >
                        {({
                            errors,
                            values,
                            touched,
                            isValid,
                            handleChange,
                        }) => (
                            <Form className="from">
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
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <input
                                        id="username"
                                        label="Tên Đăng Nhập"
                                        name="username"
                                        className={inputClass}
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                    {errors &&
                                    errors.username &&
                                    touched.username ? (
                                        <span className="mt-1 text-sm text-red-600">
                                            {errors.username}
                                        </span>
                                    ) : null}
                                </FormGroup>
                                <FormGroup className="form__group">
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <input
                                        id="password"
                                        label="Mật khẩu"
                                        name="password"
                                        type="password"
                                        className={inputClass}
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    {errors &&
                                    errors.password &&
                                    touched.password ? (
                                        <span className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </span>
                                    ) : null}
                                </FormGroup>
                                <div className="mt-5 flex justify-between px-5">
                                    <Button
 className="h-[50px] w-[150px]"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/register');
                                            }} variant="secondary"
                                        >
                                            Đăng ký
                                        </Button>
                                    <Button
 className="h-[50px] w-[150px]"
                                            type="submit"
                                            disabled={!isValid}
                                        >
                                            Đăng nhập
                                        </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
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
