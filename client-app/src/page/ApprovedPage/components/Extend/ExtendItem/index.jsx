import React from 'react';
import { getTime } from '../../../../../helper/time';
import { Button } from '../../../../../ui';

export default function ExtendItem(props) {
    const { index, item, handleClick, handleApprove, handleReject } = props;
    return (
        <tr>
            <th scope="row" onClick={() => handleClick(item.id)}>
                {index + 1}
            </th>
            <td onClick={() => handleClick(item.id)}>{item && item.title}</td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.ownerName}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {item && getTime(item.dateAdded)}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.extendPeriod}
            </td>
            <td>
                <Button
                    onClick={() => handleApprove(item.extendId)}
                >
                    <i className="fas fa-check-circle"></i> Chấp nhận
                </Button>
                <Button variant="danger"
                    onClick={() => handleReject(item.extendId)}
                >
                    <i className="fas fa-ban"></i> Từ chối
                </Button>
            </td>
        </tr>
    );
}
