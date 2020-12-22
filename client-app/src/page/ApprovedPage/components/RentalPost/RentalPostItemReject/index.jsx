import React from 'react';

export default function RentalPostItemReject(props) {
    const { rentalPost, index, handleClick, handleConfirm } = props;
    return (
        <tr style={{ cursor: 'pointer' }}>
            <th scope="row" onClick={handleClick}>
                {index}
            </th>
            <td onClick={handleClick}>{rentalPost && rentalPost.title}</td>
            <td onClick={handleClick}>{rentalPost && rentalPost.ownerName}</td>
            <td onClick={handleClick}>{rentalPost && rentalPost.ownerEmail}</td>
            <td onClick={handleClick}>{rentalPost && rentalPost.dateAdded}</td>
            <td>
                <button
                    className="btn btn-primary"
                    onClick={() => handleConfirm(rentalPost.id)}
                >
                    Xác nhận
                </button>
            </td>
        </tr>
    );
}
