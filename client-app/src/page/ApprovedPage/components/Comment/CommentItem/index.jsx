import React from 'react';

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
                <button
                    className="btn btn-primary"
                    onClick={() => handleApprove(item.id, index)}
                >
                    <i class="fas fa-check-circle"></i> Xác nhận
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => handleReject(item.id, index)}
                >
                    <i class="fas fa-ban"></i> Từ chối
                </button>
            </td>
        </tr>
    );
}
