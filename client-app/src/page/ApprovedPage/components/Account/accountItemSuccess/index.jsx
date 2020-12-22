import React from 'react';

export default function AccItemSuccess(props) {
    const { account, index, onConfirm, onRefuse } = props;
    return (
        <tr>
            <th scope="row">{index + 1}</th>
            <td>{account && account.name}</td>
            <td>{account && account.identification}</td>
            <td>{account && account.address}</td>
            <td>{account && account.phone}</td>
            <td>{account && account.email}</td>
        </tr>
    );
}
