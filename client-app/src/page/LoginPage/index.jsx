import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, FormControl, Input, FormGroup, InputLabel } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import './style.css';
import authApi from '../../api/authApi'
import {setUser} from '../../redux/slice/userSlice'
import {useSelector, useDispatch} from 'react-redux';

LoginPage.propTypes = {}

function LoginPage(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [message, setMessage] = useState(''); 
    const [role, useRole] = useState('');
    const initialValues = {
        username: '',
        password: '',
    }
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Tên đăng nhập không được bỏ trống')
            .min(5, 'Tên đăng nhập phải từ 6 ký tự trở lên'),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(6,'Mật khẩu phải chứa ít nhất 6 ký tự'),
    })
    const handleSubmit = async(value) => {
        console.log('Submit Login', value)
        const {username, password} = value;
        try {
            const response = await authApi.postLogin(username, password);
            const {access_token, account_id, role, user_id, name} = response;
            dispatch(setUser({account_id, user_id, role, name}));
            console.log(response)
            localStorage.setItem('token', access_token);
            localStorage.setItem('role', role);
            setMessage('Bạn đã đăng nhập thành công')
            history.push('/');
        } catch (error) {
            console.log(error)
            setMessage('Bạn đã nhập sai tên đăng nhập hoặc mật khẩu');
        }
    }
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
                            <Button type="submit" disabled={!isValid}  variant="contained" color="primary">Submit</Button>
                        </FormControl>
                    </Form>
                )}
            </Formik>
        </Fragment>
    )
}

export default LoginPage
