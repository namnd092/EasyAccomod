import React from 'react';
import { Button } from '../../../../../ui';

export default function AccountItemEditRequire(props) {
    const { account, index, handleCanEdit } = props;
    return (
        <tr>
            <th scope="row">{index + 1}</th>
            <td>{account && account.name}</td>
            <td>{account && account.identification}</td>
            <td>{account && account.address}</td>
            <td>{account && account.phone}</td>
            <td>{account && account.email}</td>
            <td>
                <Button
                    onClick={() => handleCanEdit(account.id, true, index)}
                >
                    <i className="fas fa-check-circle"></i> Xác nhận
                </Button>
                <Button variant="danger"
                    onClick={() => handleCanEdit(account.id, false, index)}
                >
                    <i className="fas fa-ban"></i> Từ chối
                </Button>
            </td>
        </tr>
    );
}
