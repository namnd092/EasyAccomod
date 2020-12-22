import React from 'react';

export default function FavoriteItem(props) {
    const { gotoPost, handleDislike } = props;
    return (
        <tr>
            <th scope="row" onClick={() => gotoPost(1)}>
                1
            </th>
            <td onClick={() => gotoPost(1)}>
                Simple title Simple title Simple title Simple title Simple title
                Simple title
            </td>
            <td onClick={() => gotoPost(1)}>Chưa cho thuê</td>
            <td>
                <button className="btn btn-danger" onClick={handleDislike}>
                    <i class="fas fa-heart-broken"></i> Bỏ thích
                </button>
            </td>
        </tr>
    );
}
