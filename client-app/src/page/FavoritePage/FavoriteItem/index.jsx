import React from 'react';

export default function FavoriteItem(props) {
    const { gotoPost, handleDislike, item, index } = props;
    return (
        <tr>
            <th scope="row" onClick={() => gotoPost(item.id)}>
                {index + 1}
            </th>
            <td onClick={() => gotoPost(item.id)}>{item && item.title}</td>
            <td onClick={() => gotoPost(item.id)}>Chưa cho thuê</td>
            <td>
                <button className="btn btn-danger" onClick={handleDislike}>
                    <i class="fas fa-heart-broken"></i> Bỏ thích
                </button>
            </td>
        </tr>
    );
}
