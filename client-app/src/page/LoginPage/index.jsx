import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import { TextField, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

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
    })
    const gotoRegister = () => {
        history.push('/register')
    }
    const handleSubmit = (value) => {
        console.log('Submit Login', value)
    }
    
    return (
        <div>
            <h1>Login</h1>
            <Formik
                validationSchema={validationSchema}
                onSubmit={(value) => handleSubmit(value)}
                initialValues={initialValues}
            >
                {({ errors, touched, isValid }) => (
                    <Form>
                        <TextField id="username" label="Tên Đăng Nhập" />
                        {errors && errors.username && touched.username ? (
                            <span>{errors.username}</span>
                        ) : null}
                        <Button type="submit" disabled={isValid}>Submit</Button>
                    </Form>
                )}
            </Formik>
            <button onClick={gotoRegister}>Register</button>
        </div>
    )
}

export default LoginPage
