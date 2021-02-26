import React from 'react';
import './style.css';
import Card from '../../../../share/components/card';
import authApi from '../../../../api/authApi';
import AccountItem from './accountItem';
import THeadComponent from './thead';
import AccItemSuccess from './accountItemSuccess';
import AccountItemEditRequire from './itemEditRequire';

const Account = () => {
    const [accountRegisterPending, setAccountRegisterPending] = React.useState(
        []
    );
    const [accountSuccess, setAccountSuccess] = React.useState([]);
    const [accountEditRequire, setAccountEditRequire] = React.useState([]);
    React.useEffect(() => {
        getAccountRegisterPending();
        getAccountSuccess();
        getAccountEditRequire();
    }, []);
    async function getAccountRegisterPending() {
        try {
            const accountRegisterPendingResponse = await authApi.getOwnerRegisterPending(
                1,
                15
            );
            console.log(accountRegisterPendingResponse);
            setAccountRegisterPending([
                ...accountRegisterPendingResponse.owners,
            ]);
        } catch (error) {
            console.log(error);
            setAccountRegisterPending([]);
        }
    }
    async function getAccountSuccess() {
        try {
            const accountSuccessResponse = await authApi.getOwnerSuccess(1, 15);
            console.log(accountSuccessResponse);
            setAccountSuccess([...accountSuccessResponse.owners]);
        } catch (error) {
            console.log(error);
            setAccountSuccess([]);
        }
    }
    async function getAccountEditRequire() {
        try {
            const response = await authApi.getAccountEditRequire(1, 15);
            console.log(response);
            setAccountEditRequire([...response.owners]);
        } catch (error) {
            console.log(error);
            setAccountEditRequire([]);
        }
    }
    const handleConfirmAccRegisterPending = async (accountId, index) => {
        try {
            setAccountSuccess(
                accountSuccess.concat(accountRegisterPending.splice(index, 1))
            );
            setAccountRegisterPending([...accountRegisterPending]);
            const response = await authApi.postSetOwner(accountId);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    const handleRefuseAccRegisterPending = async (accountId, index) => {
        try {
            accountRegisterPending.splice(index, 1);
            setAccountRegisterPending([...accountRegisterPending]);
            const response = await authApi.postRejectOwner(accountId);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSetOwnerCanEdit = async (ownerId, canEdit, index) => {
        try {
            accountEditRequire.splice(index, 1);
            setAccountEditRequire([...accountEditRequire]);
            const response = await authApi.postOwnerCanEditInfo(
                ownerId,
                canEdit
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="approved__account">
            <Card title={'Tài khoản đăng ký đang chờ'}>
                <table class="table table-hover">
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
            {/* <Card title={'Tài khoản chỉnh sửa đang chờ'}>
                <table class="table table-hover">
                    <THeadComponent />
                    <tbody>
                        {accountEditPending.length === 0 ? (
                            <p>Không tìm thấy tài khoản nào</p>
                        ) : (
                            accountEditPending.map((item, index) => (
                                <AccountItemEditPending
                                    key={item.id}
                                    account={item}
                                    index={index}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card> */}
            <Card title={'Tài khoản yêu cầu quyền chỉnh sửa'}>
                <table class="table table-hover">
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
                <table class="table table-hover">
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
