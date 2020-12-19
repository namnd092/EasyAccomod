import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from '@material-ui/core';
import Card from '../../share/components/card';

ProfilePage.propTypes = {};

function ProfilePage(props) {
    const initialValues = {
        name: '',
        email: '',
        phone: '',
        address: '',
        identification: '',
    };
    const [haveEditing, setHaveEditing] = React.useState(false);
    return (
        <div>
            <Card title="Thông tin cá nhân">
                <Formik initialValues={initialValues}>
                    {({ errors, values, handleChange }) => (
                        <Form>
                            <FormGroup>
                                <FormLabel>Tên</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Email</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Phone</FormLabel>
                                <input
                                    className="form-control"
                                    type="number"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Address</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Identification</FormLabel>
                                <input
                                    className="form-control"
                                    type="number"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    variant="contained"
                                    className="btn btn-primary"
                                    color="primary"
                                    disabled={!haveEditing}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    variant="contained"
                                    className="btn btn-primary"
                                    color="primary"
                                    disabled={haveEditing}
                                >
                                    Xin chỉnh sửa tài khoản
                                </Button>
                            </FormGroup>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}

export default ProfilePage;
