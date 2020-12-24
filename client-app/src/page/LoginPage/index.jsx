import React, { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    FormGroup,
    InputLabel,
    Backdrop,
    CircularProgress,
    makeStyles,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import './style.css';
import authApi from '../../api/authApi';
import { setUser } from '../../redux/slice/userSlice';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';

LoginPage.propTypes = {
    handle: PropTypes.func,
};
LoginPage.defaultType = {
    handle: null,
};

function LoginPage(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const initialValues = {
        username: '',
        password: '',
    };
    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));
    const classes = useStyles();
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
            Axios.get('https://localhost:44360/' + ApiUrl.GET_ACCOUNT_INFO, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            })
                .then(async (response) => {
                    const infoResponse = await response.data;
                    await dispatch(setUser({ ...infoResponse }));
                    setMessage('Bạn đã đăng nhập thành công');
                    history.push('/');
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
                            <Form className={'from'}>
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
                                <FormGroup className={'form__group'}>
                                    <InputLabel>Tên đăng nhập</InputLabel>
                                    <input
                                        id="username"
                                        label="Tên Đăng Nhập"
                                        name="username"
                                        className="form-control"
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                    {errors &&
                                    errors.username &&
                                    touched.username ? (
                                        <span className="error">
                                            {errors.username}
                                        </span>
                                    ) : null}
                                </FormGroup>
                                <FormGroup className={'form__group'}>
                                    <InputLabel>Mật khẩu</InputLabel>
                                    <input
                                        id="password"
                                        label="Mật khẩu"
                                        name="password"
                                        type="password"
                                        className="form-control"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                    {errors &&
                                    errors.password &&
                                    touched.password ? (
                                        <span className="error">
                                            {errors.password}
                                        </span>
                                    ) : null}
                                </FormGroup>
                                <div className="group-btn">
                                    <div className="btn-group">
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                history.push('/register');
                                            }}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Đăng ký
                                        </Button>
                                    </div>
                                    <div className="btn-group">
                                        <Button
                                            type="submit"
                                            disabled={!isValid}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Đăng nhập
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            {isLoading && (
                <Backdrop
                    className={classes.backdrop}
                    open={() => setIsLoading(true)}
                    onClick={() => setIsLoading(false)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </div>
    );
}

export default LoginPage;
