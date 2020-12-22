import { Button, FormGroup, FormLabel } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { ownerRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { ownerRegisterValidationSchema } from '../../../models/ValidateForm/register';

export default function OwnerRegister(props) {
    const history = useHistory();
    const handleSubmit = async (values) => {
        try {
            const response = await authApi.ownerRegister(values);
            console.log(response);
            history.push('/login');
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
                {({ errors, touched, values, isValid, handleChange }) => (
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
                            {errors && errors.username && touched.username ? (
                                <span className="error">{errors.username}</span>
                            ) : null}
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
                            {errors && errors.password && touched.password ? (
                                <span className="error">{errors.password}</span>
                            ) : null}
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
                                name="name"
                                className="form-control"
                                value={values.name}
                                onChange={handleChange}
                            />
                            {errors && errors.name && touched.name ? (
                                <span className="error">{errors.name}</span>
                            ) : null}
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
                            {errors && errors.address && touched.address ? (
                                <span className="error">{errors.address}</span>
                            ) : null}
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
                            {errors && errors.email && touched.email ? (
                                <span className="error">{errors.email}</span>
                            ) : null}
                        </FormGroup>
                        <div className="row">
                            <FormGroup className="col-6">
                                <FormLabel>Số điện thoại</FormLabel>
                                <Field
                                    type="number"
                                    name="phone"
                                    className="form-control"
                                    value={values.phone}
                                    onChange={handleChange}
                                />
                                {errors && errors.phone && touched.phone ? (
                                    <span className="error">
                                        {errors.phone}
                                    </span>
                                ) : null}
                            </FormGroup>
                            <FormGroup className="col-6">
                                <FormLabel>CMTND/CCCD</FormLabel>
                                <Field
                                    type="number"
                                    name="identification"
                                    className="form-control"
                                    value={values.identification}
                                    onChange={handleChange}
                                />
                                {errors &&
                                errors.identification &&
                                touched.identification ? (
                                    <span className="error">
                                        {errors.identification}
                                    </span>
                                ) : null}
                            </FormGroup>
                        </div>
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
