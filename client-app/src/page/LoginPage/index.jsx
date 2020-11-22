import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, FormControl, Input, FormGroup, InputLabel } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import './style.css';
import authApi from '../../api/authApi'

LoginPage.propTypes = {}

function LoginPage(props) {
    const history = useHistory()
    const initialValues = {
        username: '',
        password: '',
    }
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Tên đăng nhập không được bỏ trống')
            .min(6, 'Tên đăng nhập phải từ 6 ký tự trở lên'),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(6,'Mật khẩu phải chứa ít nhất 6 ký tự'),
    })
    const gotoRegister = () => {
        history.push('/register')
    }
    const handleSubmit = async(value) => {
        console.log('Submit Login', value)
        const {username, password} = value;
        const response = await authApi.postLogin(username, password)
        console.log(response)
        const data = response.data;
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
