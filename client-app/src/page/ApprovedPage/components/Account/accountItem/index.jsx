import React from 'react';

export default function AccountItem(props) {
    const { account, index, onConfirm, onRefuse } = props;
    return (
        <tr>
            <th scope="row">{index + 1}</th>
            <td>{account && account.name}</td>
            <td>{account && account.identification}</td>
            <td>{account && account.address}</td>
            <td>{account && account.phone}</td>
            <td>{account && account.email}</td>
            <td>
                <button className="btn btn-danger" onClick={onRefuse}>
                    Từ chối
                </button>
                <button className="btn btn-primary" onClick={onConfirm}>
                    Xác nhận
                </button>
            </td>
        </tr>
    );
}
