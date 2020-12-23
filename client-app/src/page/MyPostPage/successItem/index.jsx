import React from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ExtendDuration from '../extend';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Button } from '@material-ui/core';
import rentalPost from '../../../api/rentalPost';
import { getTime } from '../../../helper/time';
function SuccessItem(props) {
    const { index, item, handleClick } = props;
    const [isRented, setRented] = React.useState(item.accommodationWasRented);
    const hanldeChangeIsRented = async () => {
        setRented(!isRented);
        try {
            const response = await rentalPost.putOwnerSetRentalStatus(
                !isRented,
                item.accommodationId
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <tr style={{ cursor: 'pointer' }}>
            <th scope="row" onClick={() => handleClick(item.id)}>
                {index + 1}
            </th>
            <td onClick={() => handleClick(item.id)}>{item && item.title}</td>
            <td onClick={() => handleClick(item.id)}>
                {item && item.address.province.name}
            </td>

            <td
                style={{ textAlign: 'center' }}
                onClick={() => handleClick(item.id)}
            >
                {item && item.views}
            </td>
            <td
                style={{ textAlign: 'center' }}
                onClick={() => handleClick(item.id)}
            >
                {item && item.likes}
            </td>
            <td onClick={() => handleClick(item.id)}>
                {getTime(item.dateExpired)}
            </td>
            <td>
                {isRented ? (
                    <button
                        className="btn btn-primary"
                        onClick={hanldeChangeIsRented}
                    >
                        <CheckBoxIcon
                            style={{
                                position: 'relative',
                                top: '6px',
                            }}
                        />{' '}
                        Đã cho thuê
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={hanldeChangeIsRented}
                    >
                        <CheckBoxOutlineBlankIcon
                            style={{
                                position: 'relative',
                                top: '6px',
                            }}
                        />{' '}
                        Chưa cho thuê
                    </button>
                )}
            </td>
            <td>
                <button
                    className="btn btn-danger"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                >
                    <i class="fas fa-money-check-alt"></i> Gia hạn
                </button>
            </td>
            <ExtendDuration postId={item.id} />
        </tr>
    );
}

export default SuccessItem;
