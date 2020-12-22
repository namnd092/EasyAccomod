import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from '@material-ui/core';
import Card from '../../share/components/card';
import { useSelector } from 'react-redux';
import Role from '../../models/data/role';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';
import rentalPost from '../../api/rentalPost';
import authApi from '../../api/authApi';

ProfilePage.propTypes = {};

function ProfilePage(props) {
    const token = localStorage.getItem('token');
    const [haveEditing, setHaveEditing] = React.useState(false);
    const [isPending, setIsPending] = React.useState(true);
    const [defaultValue, setDefaultValue] = React.useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        identification: '',
    });
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
        async function getHaveEditing() {
            try {
                const response = await authApi.getCanEditProfile();
                setHaveEditing(response.data);
            } catch (error) {
                console.log(error);
                setHaveEditing(false);
            }
        }
        getHaveEditing();
    }, []);
    const handleSubmit = async (value) => {
        console.log(value);
        try {
            const response = await authApi.putEditProfile({ ...value });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    const handleRequireEditInfo = async () => {
        setIsPending(false);
        try {
            const response = await authApi.postRequireEditInfo();
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="profilePage pt-5">
            <Card title="Thông tin cá nhân">
                <Formik
                    initialValues={defaultValue}
                    onSubmit={(value) => handleSubmit(value)}
                    enableReinitialize
                >
                    {({ errors, values, handleChange }) => (
                        <Form>
                            <div className="row">
                                <FormGroup className="col-6">
                                    <FormLabel>Tên</FormLabel>
                                    <input
                                        className="form-control"
                                        name="name"
                                        readOnly={!haveEditing}
                                        onChange={handleChange}
                                        value={values.name}
                                        //defaultValue={defaultValue.name}
                                    />
                                </FormGroup>
                                <FormGroup className="col-6">
                                    <FormLabel>Email</FormLabel>
                                    <input
                                        className="form-control"
                                        name="email"
                                        readOnly={!haveEditing}
                                        onChange={handleChange}
                                        //defaultValue={defaultValue.email}
                                        value={values.email}
                                    />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <FormLabel>Address</FormLabel>
                                <input
                                    className="form-control"
                                    readOnly={!haveEditing}
                                    name="address"
                                    onChange={handleChange}
                                    //defaultValue={defaultValue.address}
                                    value={values.address}
                                />
                            </FormGroup>
                            <div className="row">
                                <FormGroup className="col-6">
                                    <FormLabel>Phone</FormLabel>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="phone"
                                        readOnly={!haveEditing}
                                        onChange={handleChange}
                                        //defaultValue={defaultValue.phone}
                                        value={values.phone}
                                    />
                                </FormGroup>

                                <FormGroup className="col-6">
                                    <FormLabel>Identification</FormLabel>
                                    <input
                                        className="form-control"
                                        name="identification"
                                        type="number"
                                        readOnly={!haveEditing}
                                        onChange={handleChange}
                                        value={values.identification}
                                        //defaultValue={defaultValue.identification}
                                    />
                                </FormGroup>
                            </div>
                            <div className="btn-group">
                                <Button
                                    variant="contained"
                                    className="btn btn-primary"
                                    color="primary"
                                    disabled={!haveEditing}
                                    type="submit"
                                    style={{
                                        display: !isPending ? '' : 'none',
                                    }}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    variant="contained"
                                    className="btn btn-primary"
                                    color="primary"
                                    onClick={handleRequireEditInfo}
                                    style={{
                                        display: isPending ? '' : 'none',
                                    }}
                                >
                                    Yêu cầu chỉnh sửa tài khoản
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}

export default ProfilePage;
