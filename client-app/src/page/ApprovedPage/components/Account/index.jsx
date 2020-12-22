import React from 'react';
import './style.css';
import Card from '../../../../share/components/card';
import authApi from '../../../../api/authApi';
import AccountItem from './accountItem';
import THeadComponent from './thead';
import AccItemSuccess from './accountItemSuccess';

const Account = () => {
    const [accountRegisterPending, setAccountRegisterPending] = React.useState(
        []
    );
    const [accountSuccess, setAccountSuccess] = React.useState([]);
    React.useEffect(() => {
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
        getAccountRegisterPending();
        async function getAccountSuccess() {
            try {
                const accountSuccessResponse = await authApi.getOwnerSuccess(
                    1,
                    15
                );
                console.log(accountSuccessResponse);
                setAccountSuccess([...accountSuccessResponse.owners]);
            } catch (error) {
                console.log(error);
                setAccountSuccess([]);
            }
        }
        getAccountSuccess();
    }, []);
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
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
            <Card title={'Tài khoản chỉnh sửa đang chờ'}>
                <table class="table table-hover"></table>
            </Card>
            <Card title={'Tài khoản yêu cầu quyền chỉnh sửa'}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <button className="btn btn-danger">
                                    Từ chối
                                </button>
                                <button className="btn btn-primary">
                                    Xác nhận
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>Larry</td>
                            <td>@twitter</td>
                        </tr>
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
