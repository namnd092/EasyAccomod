import React from 'react';

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
                {item && item.ownerEmail}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.dateAdded}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.extendPeriod}
            </td>
            <td>
                <button
                    className="btn btn-primary"
                    onClick={() => handleApprove(item.extendId)}
                >
                    Chấp nhận
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => handleReject(item.extendId)}
                >
                    Từ chối
                </button>
            </td>
        </tr>
    );
}
