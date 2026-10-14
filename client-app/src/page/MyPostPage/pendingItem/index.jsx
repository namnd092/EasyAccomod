import React from 'react';
import { getTime } from '../../../helper/time';
import { Button } from '../../../ui';

export default function PendingItem(props) {
    const { index, item, handleClick, handleEditPost } = props;
    return (
        <tr style={{ cursor: 'pointer' }}>
            <th scope="row" onClick={() => handleClick(item.id)}>
                {index + 1}
            </th>
            <td onClick={() => handleClick(item.id)}>{item && item.title}</td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.address.province.name}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {getTime(item.dateExpired)}
            </td>
            <td>
                <Button
                    onClick={() => handleEditPost(item.id)}
                >
                    {' '}
                    <i className="far fa-edit"></i> Chỉnh sửa
                </Button>
            </td>
        </tr>
    );
}
