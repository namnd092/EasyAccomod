import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { ownerRegisterInitialValue } from '../../../models/InitialValueForm/register';
import { ownerRegisterValidationSchema } from '../../../models/ValidateForm/register';
import { Button, FormGroup, FormLabel, inputClass } from '../../../ui';

export default function OwnerRegister(props) {
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        try {
            const response = await authApi.ownerRegister(values);
            console.log(response);
            navigate('/login');
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
                                className={inputClass}
                                value={values.username}
                                onChange={handleChange}
                            />
                            {errors && errors.username && touched.username ? (
                                <span className="mt-1 text-sm text-red-600">{errors.username}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Mật khẩu</FormLabel>
                            <Field
                                type="password"
                                name="password"
                                className={inputClass}
                                value={values.password}
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
                                name="confirmPassword"
                                className={inputClass}
                                value={values.confirmPassword}
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
                                name="name"
                                className={inputClass}
                                value={values.name}
                                onChange={handleChange}
                            />
                            {errors && errors.name && touched.name ? (
                                <span className="mt-1 text-sm text-red-600">{errors.name}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Địa chỉ</FormLabel>
                            <Field
                                type="text"
                                name="address"
                                className={inputClass}
                                value={values.address}
                                onChange={handleChange}
                            />
                            {errors && errors.address && touched.address ? (
                                <span className="mt-1 text-sm text-red-600">{errors.address}</span>
                            ) : null}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <Field
                                type="text"
                                name="email"
                                className={inputClass}
                                value={values.email}
                                onChange={handleChange}
                            />
                            {errors && errors.email && touched.email ? (
                                <span className="mt-1 text-sm text-red-600">{errors.email}</span>
                            ) : null}
                        </FormGroup>
                        <div className="grid grid-cols-12 gap-x-4">
                            <FormGroup className="col-span-6">
                                <FormLabel>Số điện thoại</FormLabel>
                                <Field
                                    type="text"
                                    name="phone"
                                    className={inputClass}
                                    value={values.phone}
                                    onChange={handleChange}
                                />
                                {errors && errors.phone && touched.phone ? (
                                    <span className="mt-1 text-sm text-red-600">
                                        {errors.phone}
                                    </span>
                                ) : null}
                            </FormGroup>
                            <FormGroup className="col-span-6">
                                <FormLabel>CMTND/CCCD</FormLabel>
                                <Field
                                    type="text"
                                    name="identification"
                                    className={inputClass}
                                    value={values.identification}
                                    onChange={handleChange}
                                />
                                {errors &&
                                errors.identification &&
                                touched.identification ? (
                                    <span className="mt-1 text-sm text-red-600">
                                        {errors.identification}
                                    </span>
                                ) : null}
                            </FormGroup>
                        </div>
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
