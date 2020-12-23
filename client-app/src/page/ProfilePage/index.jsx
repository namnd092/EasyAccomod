import React from 'react';
import './style.css';
import { Form, Formik } from 'formik';
import { Button, FormGroup, FormLabel } from '@material-ui/core';
import Card from '../../share/components/card';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';
import authApi from '../../api/authApi';
import ownerRegisterValidationSchema from '../../models/ValidateForm/profile';
import TelegramIcon from '@material-ui/icons/Telegram';

ProfilePage.propTypes = {};

function ProfilePage(props) {
    const token = localStorage.getItem('token');
    const [haveEditing, setHaveEditing] = React.useState(-1);
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
                console.log(response);
                setHaveEditing(response.result);
            } catch (error) {
                console.log(error);
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
        setHaveEditing(0);
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
                    validationSchema={ownerRegisterValidationSchema}
                >
                    {({ errors, values, handleChange, touched }) => (
                        <Form>
                            <div className="row">
                                <FormGroup className="col-6">
                                    <FormLabel>Tên</FormLabel>
                                    <input
                                        className="form-control"
                                        name="name"
                                        onChange={handleChange}
                                        value={values.name}
                                        readOnly={haveEditing !== 1}
                                        //defaultValue={defaultValue.name}
                                    />
                                    {errors && errors.name && touched.name ? (
                                        <span className="error">
                                            {errors.name}
                                        </span>
                                    ) : null}
                                </FormGroup>
                                <FormGroup className="col-6">
                                    <FormLabel>Email</FormLabel>
                                    <input
                                        className="form-control"
                                        name="email"
                                        onChange={handleChange}
                                        readOnly={haveEditing !== 1}
                                        //defaultValue={defaultValue.email}
                                        value={values.email}
                                    />
                                    {errors && errors.email && touched.email ? (
                                        <span className="error">
                                            {errors.email}
                                        </span>
                                    ) : null}
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <FormLabel>Address</FormLabel>
                                <input
                                    className="form-control"
                                    name="address"
                                    onChange={handleChange}
                                    readOnly={haveEditing !== 1}
                                    //defaultValue={defaultValue.address}
                                    value={values.address}
                                />
                                {errors && errors.address && touched.address ? (
                                    <span className="error">{errors.name}</span>
                                ) : null}
                            </FormGroup>
                            <div className="row">
                                <FormGroup className="col-6">
                                    <FormLabel>Phone</FormLabel>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="phone"
                                        onChange={handleChange}
                                        readOnly={haveEditing !== 1}
                                        //defaultValue={defaultValue.phone}
                                        value={values.phone}
                                    />
                                    {errors && errors.phone && touched.phone ? (
                                        <span className="error">
                                            {errors.phone}
                                        </span>
                                    ) : null}
                                </FormGroup>

                                <FormGroup className="col-6">
                                    <FormLabel>Identification</FormLabel>
                                    <input
                                        className="form-control"
                                        name="identification"
                                        type="number"
                                        onChange={handleChange}
                                        readOnly={haveEditing !== 1}
                                        value={values.identification}
                                        //defaultValue={defaultValue.identification}
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
                            <div className="btn-group">
                                {haveEditing === -1 ? (
                                    <Button
                                        variant="contained"
                                        className="btn btn-primary"
                                        color="primary"
                                        onClick={handleRequireEditInfo}
                                    >
                                        Yêu cầu chỉnh sửa tài khoản
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        className="btn btn-primary"
                                        color="primary"
                                        type="submit"
                                        disabled={haveEditing === 0}
                                    >
                                        Xác nhận
                                        <TelegramIcon
                                            style={{ marginLeft: '8px' }}
                                        />
                                    </Button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}

export default ProfilePage;
