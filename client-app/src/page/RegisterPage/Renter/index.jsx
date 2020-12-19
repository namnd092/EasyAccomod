import { Button, FormGroup, FormLabel } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import authApi from '../../../api/authApi';

export default function RenterRegister(props) {
    const initialValues = {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
    };
    const validationSchema = {};
    const handleSubmit = async (values) => {
        try {
            const response = await authApi.renterRegister(values);
            console.log(response);
        } catch (error) {}
        console.log(values);
    };
    return (
        <div>
            <Formik
                onSubmit={(values) => handleSubmit(values)}
                initialValues={initialValues}
                // validationSchema={validationSchema}
            >
                {({ errors, values, isValid, handleChange }) => (
                    <Form>
                        <FormGroup>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <Field
                                type="text"
                                value={values.username}
                                onChange={handleChange}
                                className="form-control"
                                name="username"
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Mật khẩu</FormLabel>
                            <Field
                                type="password"
                                value={values.password}
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <Field
                                type="password"
                                value={values.confirmPassword}
                                name="confirmPassword"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Tên</FormLabel>
                            <Field
                                type="text"
                                value={values.name}
                                name="name"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <Field
                                type="email"
                                value={values.email}
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button
                                type="submit"
                                color="primary"
                                size="large"
                                variant="contained"
                                style={{ margin: '20px' }}
                                disabled={!isValid}
                            >
                                Đăng ký
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
