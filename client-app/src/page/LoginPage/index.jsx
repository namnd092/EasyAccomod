import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    FormControl,
    Input,
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
import { useSelector, useDispatch } from 'react-redux';

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
            const response = await authApi.postLogin(username, password);
            const { access_token, account_id, role, user_id, name } = response;
            await dispatch(setUser({ account_id, user_id, role, name }));
            console.log(response);
            await localStorage.setItem('token', access_token);
            setRole(role);
            setMessage('Bạn đã đăng nhập thành công');
            history.push('/');
        } catch (error) {
            console.log(error);
            setMessage('Bạn đã nhập sai tên đăng nhập hoặc mật khẩu');
        }finally{
            setIsLoading(false);
        }
    };
    return (
        <Fragment>
            <h1>Login</h1>
            <Formik
                validationSchema={validationSchema}
                onSubmit={(value) => handleSubmit(value)}
                initialValues={initialValues}
            >
                {({ errors, touched, isValid }) => (
                    <Form className={'from'}>
                        {message && <span>{message}</span>}
                        <FormGroup className={'form__group'}>
                            <InputLabel>Tên đăng nhập</InputLabel>
                            <Field
                                id="username"
                                label="Tên Đăng Nhập"
                                name="username"
                            />
                            {errors && errors.username && touched.username ? (
                                <span>{errors.username}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup className={'form__group'}>
                            <InputLabel>Mật khẩu</InputLabel>
                            <Field
                                id="password"
                                label="Mật khẩu"
                                name="password"
                                type="password"
                            />
                            {errors && errors.password && touched.password ? (
                                <span>{errors.password}</span>
                            ) : null}
                        </FormGroup>
                        <FormControl>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </FormControl>
                    </Form>
                )}
            </Formik>
            {isLoading && <Backdrop className={classes.backdrop} open={() => setIsLoading(true)} onClick={() => setIsLoading(false)}>
                <CircularProgress color="inherit" />
            </Backdrop>}
        </Fragment>
    );
}

export default LoginPage;
