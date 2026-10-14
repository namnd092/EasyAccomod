import React from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../share/components/card';
import authApi from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, FormLabel, inputClass } from '../../ui';
import { notifyError } from '../../helper/notify';

function ProfilePage() {
    const navigate = useNavigate();
    const [haveEditing, setHaveEditing] = React.useState(-1);
    const [defaultValue, setDefaultValue] = React.useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        identification: '',
    });
    React.useEffect(() => {
        async function effectGetInfo() {
            try {
                const info = await authApi.getAccountInfoByToken();
                setDefaultValue({
                    name: info?.name || '',
                    email: info?.email || '',
                    phone: info?.phone || '',
                    address: info?.address || '',
                    identification: info?.identification || '',
                });
            } catch (error) {
                notifyError(error);
            }
        }
        effectGetInfo();
        async function getHaveEditing() {
            try {
                const response = await authApi.getCanEditProfile();
                setHaveEditing(response.result);
            } catch (error) {
                notifyError(error);
            }
        }
        getHaveEditing();
    }, []);
    const { register, handleSubmit: withValues } = useForm({ values: defaultValue });
    const handleSubmit = async (value) => {
        try {
            await authApi.putEditProfile({ ...value });
            navigate('/');
        } catch (error) {
            notifyError(error);
        }
    };
    const handleRequireEditInfo = async () => {
        setHaveEditing(0);
        try {
            await authApi.postRequireEditInfo();
        } catch (error) {
            notifyError(error);
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
