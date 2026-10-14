import React from 'react';
import './style.css';
import Card from '../../../../share/components/card';
import authApi from '../../../../api/authApi';
import AccountItem from './accountItem';
import THeadComponent from './thead';
import AccItemSuccess from './accountItemSuccess';
import AccountItemEditRequire from './itemEditRequire';
import { tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';

const Account = () => {
    const [accountRegisterPending, setAccountRegisterPending] = React.useState(
        []
    );
    const [accountSuccess, setAccountSuccess] = React.useState([]);
    const [accountEditRequire, setAccountEditRequire] = React.useState([]);
    React.useEffect(() => {
        async function getAccountRegisterPending() {
            try {
                const accountRegisterPendingResponse = await authApi.getOwnerRegisterPending(
                    1,
                    15
                );
                setAccountRegisterPending([
                    ...accountRegisterPendingResponse.owners,
                ]);
            } catch (error) {
                notifyError(error);
                setAccountRegisterPending([]);
            }
        }
        getAccountRegisterPending();
        async function getAccountSuccess() {
            try {
                const accountSuccessResponse = await authApi.getOwnerSuccess(
                    1,
                    15
                );
                setAccountSuccess([...accountSuccessResponse.owners]);
            } catch (error) {
                notifyError(error);
                setAccountSuccess([]);
            }
        }
        getAccountSuccess();
        async function getAccountEditRequire() {
            try {
                const response = await authApi.getAccountEditRequire(1, 15);
                setAccountEditRequire([...response.owners]);
            } catch (error) {
                notifyError(error);
                setAccountEditRequire([]);
            }
        }
        getAccountEditRequire();
    }, []);
    const handleConfirmAccRegisterPending = async (accountId) => {
        try {
            await authApi.postSetOwner(accountId);
            const confirmed = accountRegisterPending.find((account) => account.accountId === accountId);
            setAccountRegisterPending((list) => list.filter((account) => account.accountId !== accountId));
            if (confirmed) setAccountSuccess((list) => [...list, confirmed]);
        } catch (error) {
            notifyError(error);
        }
    };
    const handleRefuseAccRegisterPending = async (accountId) => {
        try {
            await authApi.postRejectOwner(accountId);
            setAccountRegisterPending((list) => list.filter((account) => account.accountId !== accountId));
        } catch (error) {
            notifyError(error);
        }
    };
    const handleSetOwnerCanEdit = async (ownerId, canEdit) => {
        try {
            await authApi.postOwnerCanEditInfo(ownerId, canEdit);
            setAccountEditRequire((list) => list.filter((account) => account.id !== ownerId));
        } catch (error) {
            notifyError(error);
        }
    };
    return (
        <div className="approved__account">
            <Card title={'Tài khoản đăng ký đang chờ'}>
                <table className={tableClass}>
                    <THeadComponent />
                    <tbody>
                        {accountRegisterPending.length === 0 ? (
                            <p>Không tìm thấy tài khoản nào</p>
                        ) : (
                            accountRegisterPending.map((item, index) => (
                                <AccountItem
                                    key={item.id}
                                    account={item}
                                    index={index}
                                    onConfirm={handleConfirmAccRegisterPending}
                                    onRefuse={handleRefuseAccRegisterPending}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            <Card title={'Tài khoản yêu cầu quyền chỉnh sửa'}>
                <table className={tableClass}>
                    <THeadComponent />
                    <tbody>
                        {accountEditRequire.length === 0 ? (
                            <p>Không tìm thấy tài khoản nào</p>
                        ) : (
                            accountEditRequire.map((item, index) => (
                                <AccountItemEditRequire
                                    key={item.id}
                                    account={item}
                                    index={index}
                                    handleCanEdit={handleSetOwnerCanEdit}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            <Card title={'Tài khoản đã xác nhận'}>
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">CMTND/CCCD</th>
                            <th scope="col">Địa chỉ</th>
                            <th scope="col">SDT</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountSuccess.length === 0 ? (
                            <p>Không tìm thấy tài khoản nào</p>
                        ) : (
                            accountSuccess.map((item, index) => (
                                <AccItemSuccess
                                    key={item.id}
                                    account={item}
                                    index={index}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Account;
