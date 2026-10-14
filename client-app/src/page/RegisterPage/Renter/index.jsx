import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { renterRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { renterRegisterValidationSchema } from '../../../models/ValidateForm/register';
import { Button, FormGroup, FormLabel, inputClass } from '../../../ui';

export default function RenterRegister(props) {
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const response = await authApi.renterRegister(values);
            console.log(response);
            navigate('/login');
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
                                className={inputClass}
                                name="username"
                            />
                            {errors && errors.username && touched.username ? (
                                <span className="mt-1 text-sm text-red-600">{errors.username}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Mật khẩu</FormLabel>
                            <Field
                                type="password"
                                value={values.password}
                                name="password"
                                className={inputClass}
                                onChange={handleChange}
                            />
                            {errors && errors.password && touched.password ? (
                                <span className="mt-1 text-sm text-red-600">{errors.password}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <Field
                                type="password"
                                value={values.confirmPassword}
                                name="confirmPassword"
                                className={inputClass}
                                onChange={handleChange}
                            />
                            {errors &&
                            errors.confirmPassword &&
                            touched.confirmPassword ? (
                                <span className="mt-1 text-sm text-red-600">
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
                                className={inputClass}
                                onChange={handleChange}
                            />
                            {errors && errors.name && touched.name ? (
                                <span className="mt-1 text-sm text-red-600">{errors.name}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <Field
                                type="email"
                                value={values.email}
                                name="email"
                                className={inputClass}
                                onChange={handleChange}
                            />
                            {errors && errors.email && touched.email ? (
                                <span className="mt-1 text-sm text-red-600">{errors.email}</span>
                            ) : null}
                        </FormGroup>
                        {/* <FormGroup>
                            <Button
                                type="submit" size="lg"
                                style={{ margin: '20px' }}
                                disabled={!isValid}
                            >
                                Đăng ký
                            </Button>
                        </FormGroup> */}
                        <div className="mt-5 flex justify-between px-5">
                            <Button
 className="h-10 w-[150px]"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }} variant="secondary"
                                >
                                    Đăng nhập
                                </Button>
                            <Button
 className="h-10 w-[150px]"
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    Đăng ký
                                </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
