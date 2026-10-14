import React from 'react';
import { Button } from '../../../../../ui';

export default function CommentItem(props) {
    const { index, item, handleApprove, handleReject } = props;
    return (
        <tr>
            <th scope="row">{index + 1}</th>
            <td>{item && item.renterName}</td>
            <td>{item && item.rate}</td>
            <td>{item && item.content}</td>
            <td>{item && item.time}</td>
            <td>
                <Button
                    onClick={() => handleApprove(item.id, index)}
                >
                    <i className="fas fa-check-circle"></i> Xác nhận
                </Button>
                <Button variant="danger"
                    onClick={() => handleReject(item.id, index)}
                >
                    <i className="fas fa-ban"></i> Từ chối
                </Button>
            </td>
        </tr>
    );
}
