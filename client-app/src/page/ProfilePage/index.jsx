import React from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from '@material-ui/core';
import Card from '../../share/components/card';
import { useSelector } from 'react-redux';
import Role from '../../models/data/role';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';

ProfilePage.propTypes = {};

function ProfilePage(props) {
    const token = localStorage.getItem('token');
    const [haveEditing, setHaveEditing] = React.useState(false);
    const [defaultValue, setDefaultValue] = React.useState({});
    React.useEffect(() => {
        async function effectGetInfo() {
            Axios.get('https://localhost:44360/' + ApiUrl.GET_ACCOUNT_INFO, {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(async (response) => {
                    const infoResponse = await response.data;
                    console.log(infoResponse);
                    setDefaultValue({
                        name: (infoResponse && infoResponse.name) || '',
                        email: (infoResponse && infoResponse.email) || '',
                        phone: (infoResponse && infoResponse.phone) || '',
                        address: (infoResponse && infoResponse.address) || '',
                        identification:
                            (infoResponse && infoResponse.identification) || '',
                    });
                    console.log(defaultValue);
                })
                .catch((error) => console.log(error));
        }

        effectGetInfo();
    }, []);
    return (
        <div>
            <Card title="Thông tin cá nhân">
                <Formik initialValues={defaultValue}>
                    {({ errors, values, handleChange }) => (
                        <Form>
                            <FormGroup>
                                <FormLabel>Tên</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                    defaultValue={defaultValue.name}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Email</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                    defaultValue={defaultValue.email}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Phone</FormLabel>
                                <input
                                    className="form-control"
                                    type="number"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                    defaultValue={defaultValue.phone}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Address</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                    defaultValue={defaultValue.address}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Identification</FormLabel>
                                <input
                                    className="form-control"
                                    type="number"
                                    readOnly={!haveEditing}
                                    onChange={handleChange}
                                    defaultValue={defaultValue.identification}
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
                                    Yêu cầu chỉnh sửa tài khoản
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
