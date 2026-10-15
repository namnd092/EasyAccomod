import React from 'react';
import './style.css';
import Card from '../../../../share/components/card';
import authApi from '../../../../api/authApi';
import AccountItem from './accountItem';
import THeadComponent from './thead';
import AccItemSuccess from './accountItemSuccess';
import AccountItemEditRequire from './itemEditRequire';
import { Pagination, TableScroll, tableClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';
import { usePagedList } from '../../../../share/hooks/usePagedList';

const PAGE_SIZE = 15;

// One list of accounts, paged through the URL parameter `pageParam`.
function useAccounts(pageParam, fetchOwners) {
    return usePagedList({
        param: pageParam,
        load: async (page) => {
            const response = await fetchOwners(page, PAGE_SIZE);
            return { items: [...response.owners], maxPage: response.maxPage };
        },
    });
}

const EmptyRow = ({ colSpan }) => (
    <tr>
        <td colSpan={colSpan}>Không tìm thấy tài khoản nào</td>
    </tr>
);

const AccountPagination = ({ list }) => (
    <Pagination className="mt-3 justify-center" page={list.page} count={list.maxPage} onChange={list.setPage} />
);

const Account = () => {
    const pending = useAccounts('pendingPage', (page, limit) => authApi.getOwnerRegisterPending(page, limit));
    const editRequire = useAccounts('editPage', (page, limit) => authApi.getAccountEditRequire(page, limit));
    const confirmed = useAccounts('confirmedPage', (page, limit) => authApi.getOwnerSuccess(page, limit));

    // Runs the change, then loads again the lists it affects so the accounts that moved up fill the gaps.
    const change = (send, ...lists) => async (...args) => {
        try {
            await send(...args);
            lists.forEach((list) => list.reload());
        } catch (error) {
            notifyError(error);
        }
    };
    const handleConfirmAccRegisterPending = change((accountId) => authApi.postSetOwner(accountId), pending, confirmed);
    const handleRefuseAccRegisterPending = change((accountId) => authApi.postRejectOwner(accountId), pending);
    const handleSetOwnerCanEdit = change(
        (ownerId, canEdit) => authApi.postOwnerCanEditInfo(ownerId, canEdit),
        editRequire
    );
    return (
        <div className="approved__account">
            <Card title={'Tài khoản đăng ký đang chờ'}>
                <TableScroll>
                    <table className={tableClass}>
                        <THeadComponent />
                        <tbody>
                            {pending.items.length === 0 ? (
                                <EmptyRow colSpan={7} />
                            ) : (
                                pending.items.map((item, index) => (
                                    <AccountItem
                                        key={item.id}
                                        account={item}
                                        index={(pending.page - 1) * PAGE_SIZE + index}
                                        onConfirm={handleConfirmAccRegisterPending}
                                        onRefuse={handleRefuseAccRegisterPending}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </TableScroll>
                <AccountPagination list={pending} />
            </Card>
            <Card title={'Tài khoản yêu cầu quyền chỉnh sửa'}>
                <TableScroll>
                    <table className={tableClass}>
                        <THeadComponent />
                        <tbody>
                            {editRequire.items.length === 0 ? (
                                <EmptyRow colSpan={7} />
                            ) : (
                                editRequire.items.map((item, index) => (
                                    <AccountItemEditRequire
                                        key={item.id}
                                        account={item}
                                        index={(editRequire.page - 1) * PAGE_SIZE + index}
                                        handleCanEdit={handleSetOwnerCanEdit}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </TableScroll>
                <AccountPagination list={editRequire} />
            </Card>
            <Card title={'Tài khoản đã xác nhận'}>
                <TableScroll>
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
                            {confirmed.items.length === 0 ? (
                                <EmptyRow colSpan={6} />
                            ) : (
                                confirmed.items.map((item, index) => (
                                    <AccItemSuccess
                                        key={item.id}
                                        account={item}
                                        index={(confirmed.page - 1) * PAGE_SIZE + index}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </TableScroll>
                <AccountPagination list={confirmed} />
            </Card>
        </div>
    );
};

export default Account;
