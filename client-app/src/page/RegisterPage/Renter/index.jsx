import { Button, FormGroup, FormLabel } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { renterRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { renterRegisterValidationSchema } from '../../../models/ValidateForm/register';

export default function RenterRegister(props) {
    const history = useHistory();
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const response = await authApi.renterRegister(values);
            console.log(response);
            history.push('/login');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Formik
                onSubmit={(values) => handleSubmit(values)}
                initialValues={renterRegisterInitialValue}
                validationSchema={renterRegisterValidationSchema}
            >
                {({ errors, values, isValid, handleChange, touched }) => (
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
                            {errors && errors.username && touched.username ? (
                                <span className="error">{errors.username}</span>
                            ) : null}
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
                            {errors && errors.password && touched.password ? (
                                <span className="error">{errors.password}</span>
                            ) : null}
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
                            {errors &&
                            errors.confirmPassword &&
                            touched.confirmPassword ? (
                                <span className="error">
                                    {errors.confirmPassword}
                                </span>
                            ) : null}
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
                            {errors && errors.name && touched.name ? (
                                <span className="error">{errors.name}</span>
                            ) : null}
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
                            {errors && errors.email && touched.email ? (
                                <span className="error">{errors.email}</span>
                            ) : null}
                        </FormGroup>
                        {/* <FormGroup>
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
                        </FormGroup> */}
                        <div className="group-btn">
                            <div className="btn-group">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push('/login');
                                    }}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                            <div className="btn-group">
                                <Button
                                    type="submit"
                                    disabled={!isValid}
                                    variant="contained"
                                    color="primary"
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
