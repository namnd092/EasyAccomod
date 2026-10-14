import React from 'react';
import { Button } from '../../../../../ui';

export default function RentalPostItemReject(props) {
    const { rentalPost, index, handleClick, handleResolve } = props;
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
                    onClick={() => handleResolve(rentalPost.id, index)}
                >
                    <i className="fas fa-chevron-circle-up"></i> Khôi phục
                </Button>
            </td>
        </tr>
    );
}
