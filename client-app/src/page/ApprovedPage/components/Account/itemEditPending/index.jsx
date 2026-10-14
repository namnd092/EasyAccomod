import React from 'react';
import { Button } from '../../../../../ui';

export default function AccountItemEditPending(props) {
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
                <Button
                    onClick={() => onConfirm(account.id, index)}
                >
                    <i className="fas fa-check-circle"></i> Xác nhận
                </Button>
                <Button variant="danger"
                    onClick={() => onRefuse(account.id, index)}
                >
                    <i className="fas fa-ban"></i> Từ chối
                </Button>
            </td>
        </tr>
    );
}
