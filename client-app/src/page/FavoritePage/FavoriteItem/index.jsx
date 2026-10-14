import React from 'react';
import { Button } from '../../../ui';

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
                <Button variant="danger" onClick={handleDislike}>
                    <i className="fas fa-heart-broken"></i> Bỏ thích
                </Button>
            </td>
        </tr>
    );
}
