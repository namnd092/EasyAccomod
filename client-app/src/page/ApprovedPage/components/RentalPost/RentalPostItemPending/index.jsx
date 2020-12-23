import React from 'react';

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
                <button
                    className="btn btn-primary"
                    onClick={() => handleConfirm(rentalPost.id, index)}
                >
                    <i class="fas fa-check-circle"></i> Xác nhận
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => handleReject(rentalPost.id, index)}
                >
                    <i class="fas fa-ban"></i> Từ chối
                </button>
            </td>
        </tr>
    );
}
