import React from 'react';

function SuccessItem(props) {
    const { index, item } = props;
    return (
        <tr>
            <th scope="row">{index + 1}</th>
            <td>{item && item.title}</td>
            <td>{item && item.title}</td>
            <td>{item && item.title}</td>
            <td>{item && item.title}</td>
        </tr>
    );
}

export default SuccessItem;
