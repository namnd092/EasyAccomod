import React from 'react';
import { Button } from '../../../../../ui';

export default function RentalPostItemPending(props) {
    const {
        rentalPost,
        index,
        handleClick,
        handleConfirm,
        handleReject,
    } = props;
    return (
        <tr style={{ cursor: 'pointer' }}>
            <th scope="row" onClick={handleClick}>
                {index + 1}
            </th>
            <td onClick={handleClick}>{rentalPost && rentalPost.title}</td>
            <td onClick={handleClick}>{rentalPost && rentalPost.ownerName}</td>
            <td onClick={handleClick}>{rentalPost && rentalPost.ownerEmail}</td>
            <td onClick={handleClick}>{rentalPost && rentalPost.dateAdded}</td>
            <td>
                <Button
                    onClick={() => handleConfirm(rentalPost.id, index)}
                >
                    <i className="fas fa-check-circle"></i> Xác nhận
                </Button>
                <Button variant="danger"
                    onClick={() => handleReject(rentalPost.id, index)}
                >
                    <i className="fas fa-ban"></i> Từ chối
                </Button>
            </td>
        </tr>
    );
}
