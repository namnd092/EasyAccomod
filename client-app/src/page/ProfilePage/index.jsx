import React from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../share/components/card';
import Axios from 'axios';
import ApiUrl from '../../constants/ApiUrl';
import authApi from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, FormLabel, inputClass } from '../../ui';

ProfilePage.propTypes = {};

function ProfilePage(props) {
    const navigate = useNavigate();
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
            Axios.get(`${import.meta.env.VITE_API_URL}/` + ApiUrl.GET_ACCOUNT_INFO, {
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
    const { register, handleSubmit: withValues } = useForm({ values: defaultValue });
    const handleSubmit = async (value) => {
        console.log(value);
        try {
            const response = await authApi.putEditProfile({ ...value });
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            navigate('/');
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
        <div className="profilePage pt-12">
            <Card title="Thông tin cá nhân">
                <form onSubmit={withValues(handleSubmit)}>
                    <div className="grid grid-cols-12 gap-x-4">
                        <FormGroup className="col-span-6">
                            <FormLabel htmlFor="profile-name">Tên</FormLabel>
                            <input
                                id="profile-name"
                                className={inputClass}
                                readOnly={haveEditing !== 1}
                                {...register('name')}
                            />
                        </FormGroup>
                        <FormGroup className="col-span-6">
                            <FormLabel htmlFor="profile-email">Email</FormLabel>
                            <input
                                id="profile-email"
                                className={inputClass}
                                readOnly={haveEditing !== 1}
                                {...register('email')}
                            />
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <FormLabel htmlFor="profile-address">Address</FormLabel>
                        <input
                            id="profile-address"
                            className={inputClass}
                            readOnly={haveEditing !== 1}
                            {...register('address')}
                        />
                    </FormGroup>
                    <div className="grid grid-cols-12 gap-x-4">
                        <FormGroup className="col-span-6">
                            <FormLabel htmlFor="profile-phone">Phone</FormLabel>
                            <input
                                id="profile-phone"
                                className={inputClass}
                                type="number"
                                readOnly={haveEditing !== 1}
                                {...register('phone')}
                            />
                        </FormGroup>
                        <FormGroup className="col-span-6">
                            <FormLabel htmlFor="profile-identification">Identification</FormLabel>
                            <input
                                id="profile-identification"
                                className={inputClass}
                                type="number"
                                readOnly={haveEditing !== 1}
                                {...register('identification')}
                            />
                        </FormGroup>
                    </div>
                    <div className="flex justify-center gap-2">
                        {haveEditing === -1 ? (
                            <Button onClick={handleRequireEditInfo}>
                                Yêu cầu chỉnh sửa tài khoản
                            </Button>
                        ) : (
                            <Button type="submit" disabled={haveEditing === 0}>
                                Xác nhận
                                <i className="fas fa-paper-plane ml-2"></i>
                            </Button>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default ProfilePage;
