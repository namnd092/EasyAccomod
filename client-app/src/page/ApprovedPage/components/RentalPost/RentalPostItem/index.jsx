import React from 'react';

const RentalPostItem = (props) => {
    const { rentalPost, index, handleClick } = props;
    return (
        <tr onClick={handleClick} style={{ cursor: 'pointer' }}>
            <th scope="row">{index + 1}</th>
            <td>{rentalPost && rentalPost.title}</td>
            <td>{rentalPost && rentalPost.ownerName}</td>
            <td>{rentalPost && rentalPost.ownerEmail}</td>
            <td>{rentalPost && rentalPost.dateAdded}</td>
        </tr>
    );
};

export default RentalPostItem;
