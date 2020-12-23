import React from 'react';

export default function ReportItem(props) {
    const { rentalPost, index, handleClick, handleResolve } = props;
    return (
        <tr style={{ cursor: 'pointer' }}>
            <th
                scope="row"
                onClick={() =>
                    handleClick(rentalPost.accommodationRentalPostId)
                }
            >
                {index + 1}
            </th>
            <td
                onClick={() =>
                    handleClick(rentalPost.accommodationRentalPostId)
                }
            >
                {rentalPost && rentalPost.postTitle}
            </td>
            <td
                onClick={() =>
                    handleClick(rentalPost.accommodationRentalPostId)
                }
            >
                {rentalPost && rentalPost.renterName}
            </td>
            <td
                onClick={() =>
                    handleClick(rentalPost.accommodationRentalPostId)
                }
            >
                {rentalPost && rentalPost.content}
            </td>
            <td
                onClick={() =>
                    handleClick(rentalPost.accommodationRentalPostId)
                }
            >
                {rentalPost && rentalPost.time}
            </td>
            <td>
                <button
                    className="btn btn-danger"
                    onClick={() => handleResolve(rentalPost.id, index)}
                >
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        </tr>
    );
}
