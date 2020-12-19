import { Button, FormGroup, FormLabel } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import authApi from '../../../api/authApi';
import { ownerRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { ownerRegisterValidationSchema } from '../../../models/ValidateForm/register';

export default function OwnerRegister(props) {
    const handleSubmit = async (values) => {
        try {
            const response = await authApi.ownerRegister(values);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <Formik
                initialValues={ownerRegisterInitialValue}
                onSubmit={handleSubmit}
                validationSchema={ownerRegisterValidationSchema}
            >
                {({ errors, values, isValid, handleChange }) => (
                    <Form>
                        <FormGroup>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <Field
                                type="text"
                                name="username"
                                className="form-control"
                                value={values.username}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Mật khẩu</FormLabel>
                            <Field
                                type="password"
                                name="password"
                                className="form-control"
                                value={values.password}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Nhập lại mật khẩu</FormLabel>
                            <Field
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={values.confirmPassword}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Tên</FormLabel>
                            <Field
                                type="text"
                                name="name"
                                className="form-control"
                                value={values.name}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Địa chỉ</FormLabel>
                            <Field
                                type="text"
                                name="address"
                                className="form-control"
                                value={values.address}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <Field
                                type="text"
                                name="email"
                                className="form-control"
                                value={values.email}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Số điện thoại</FormLabel>
                            <Field
                                type="number"
                                name="phone"
                                className="form-control"
                                value={values.phone}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>CMTND/CCCD</FormLabel>
                            <Field
                                type="number"
                                name="identification"
                                className="form-control"
                                value={values.identification}
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
