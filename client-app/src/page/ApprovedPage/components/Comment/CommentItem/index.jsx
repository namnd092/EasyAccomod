import React from 'react';

export default function CommentItem(props) {
    const { index, item } = props;
    return (
        <tr>
            <th scope="row">{index + 1}</th>
        </tr>
    );
}
