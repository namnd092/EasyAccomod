import React from 'react';

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
                <button
                    className="btn btn-primary"
                    onClick={() => handleResolve(rentalPost.id, index)}
                >
                    <i class="fas fa-chevron-circle-up"></i> Khôi phục
                </button>
            </td>
        </tr>
    );
}
